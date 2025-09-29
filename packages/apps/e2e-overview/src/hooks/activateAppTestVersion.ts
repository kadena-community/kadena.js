import { EVENT_NAMES } from '@/utils/analytics';
import { supabaseClient } from '@/utils/db/createClient';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { AppTestVersion } from './getAllAppTestVersions';
import { useNotifications } from './notifications';

export const useActivateAppTestVersion = (appId: string) => {
  const { addNotification } = useNotifications();
  const queryClient = new QueryClient();
  const mutation = useMutation<AppTestVersion, Error, string>({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['app_test_versions', appId],
      });
    },
    mutationFn: async (testId: string) => {
      const { data, error } = await supabaseClient
        .rpc('activate_app_version', {
          p_app_id: appId,
          p_test_id: testId,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!mutation.isError) return;
    addNotification(
      {
        intent: 'negative',
        label: mutation.error.name || 'Error',
        message:
          mutation.error?.message ||
          'An error occurred while updating the app.',
      },
      {
        name: EVENT_NAMES['error:insert:app_test_version'],
        options: {
          sentryData: {
            type: 'db-error',
          },
        },
      },
    );
  }, [mutation.isError]);

  return mutation;
};
