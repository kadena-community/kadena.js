import type {
  IAnalyticsEventType,
  IAnalyticsOptionsType,
} from '@/utils/analytics';
import { analyticsEvent } from '@/utils/analytics';
import type { INotificationMinimizedProps } from '@kadena/kode-ui';
import { useNotifications as useUINotifications } from '@kadena/kode-ui/patterns';
import { useNetwork } from './networks';

export const useNotifications = () => {
  const notifications = useUINotifications();
  const { activeNetwork } = useNetwork();

  const addNotification = (
    data: Partial<INotificationMinimizedProps>,
    analytics?: { name: IAnalyticsEventType; options?: IAnalyticsOptionsType },
  ) => {
    if (analytics) {
      const explorerUrl = analytics.options?.requestKey
        ? `https://explorer.kadena.io/${activeNetwork.networkId}/transaction/${analytics.options.requestKey}`
        : undefined;

      analyticsEvent(analytics.name, {
        ...analytics.options,
        chainId: activeNetwork.chainId,
        networkId: activeNetwork.networkId,
        sentryData:
          data.intent === 'negative'
            ? analytics.options?.sentryData
              ? {
                  ...analytics.options.sentryData,
                  data: {
                    ...analytics.options.sentryData?.data,
                    explorerUrl,
                  },
                }
              : undefined
            : undefined,
      });
    }

    return notifications.addNotification(data);
  };

  return {
    ...notifications,
    addNotification,
  };
};
