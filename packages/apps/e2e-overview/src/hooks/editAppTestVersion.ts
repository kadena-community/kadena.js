import { EVENT_NAMES } from '@/utils/analytics';
import { supabaseClient } from '@/utils/db/createClient';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import type {
  AppTestVersion,
  InsertAppTestVersion,
  UpdateAppTestVersion,
} from './getAllAppTestVersions';
import { useNotifications } from './notifications';

export const useEditAppTestVersion = (appId: string, testId?: string) => {
  const { addNotification } = useNotifications();
  const mutation = useMutation<
    AppTestVersion,
    Error,
    InsertAppTestVersion | UpdateAppTestVersion
  >({
    onSuccess: () => {},
    mutationFn: async (
      insertData: InsertAppTestVersion | UpdateAppTestVersion,
    ) => {
      if (!testId) {
        const { data, error } = await supabaseClient
          .rpc('insert_app_test_version', {
            app_id_input: appId,
            script_input: insertData.script,
          })
          .select()
          .single();
        if (error) throw error;
        return data;
      }

      const { data, error } = await supabaseClient
        .from('app_test_versions')
        .update({ script: insertData.script })
        .eq('id', testId)
        .eq('app_id', appId)
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
        name: testId
          ? EVENT_NAMES['error:insert:app_test_version']
          : EVENT_NAMES['error:update:app_test_version'],
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
