import { EVENT_NAMES } from '@/utils/analytics';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNotifications } from './notifications';

interface IRunTestParams {
  appId: string;
  testId: string;
}

export const useRunTestVersion = () => {
  const { addNotification } = useNotifications();
  const mutation = useMutation<
    { appId: string; testId: string },
    Error,
    IRunTestParams
  >({
    mutationFn: async ({ appId, testId }: IRunTestParams) => {
      const result = await fetch(`/api/test/playwright`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appId,
          testId,
        }),
      }).then((res) => res.json());

      return result;
    },
  });

  useEffect(() => {
    if (!mutation.isError) return;
    const errorName = mutation.error?.name || 'Error';
    const errorMessage =
      mutation.error?.message || 'An error occurred while updating the app.';

    addNotification(
      {
        intent: 'negative',
        label: errorName,
        message: errorMessage,
      },
      {
        name: EVENT_NAMES['error:insert:testrun'],
        options: {
          sentryData: {
            type: 'error',
          },
        },
      },
    );
  }, [
    mutation.isError,
    mutation.error?.name,
    mutation.error?.message,
    addNotification,
  ]);

  return mutation;
};
