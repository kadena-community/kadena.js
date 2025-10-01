import { EVENT_NAMES } from '@/utils/analytics';
import { supabaseClient } from '@/utils/db/createClient';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { App, UpdateApp } from './getAllApps';
import { useNotifications } from './notifications';

export const useEditApp = () => {
  const { addNotification } = useNotifications();
  const mutation = useMutation<App, Error, UpdateApp>({
    mutationFn: async (updateData: UpdateApp) => {
      if (!updateData.id) {
        const { data, error } = await supabaseClient
          .from('apps')
          .insert(updateData)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      const { data, error } = await supabaseClient
        .from('apps')
        .update(updateData)
        .eq('id', updateData.id)
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
        name: EVENT_NAMES['error:update:app'],
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
