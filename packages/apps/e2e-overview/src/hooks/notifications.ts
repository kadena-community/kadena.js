import type {
  IAnalyticsEventType,
  IAnalyticsOptionsType,
} from '@/utils/analytics';
import { analyticsEvent } from '@/utils/analytics';
import type { INotificationMinimizedProps } from '@kadena/kode-ui';
import { useNotifications as useUINotifications } from '@kadena/kode-ui/patterns';

export const useNotifications = () => {
  const notifications = useUINotifications();

  const addNotification = (
    data: Partial<INotificationMinimizedProps>,
    analytics?: { name: IAnalyticsEventType; options?: IAnalyticsOptionsType },
  ) => {
    if (analytics) {
      analyticsEvent(analytics.name, {
        ...analytics.options,
        sentryData:
          data.intent === 'negative'
            ? analytics.options?.sentryData
              ? {
                  ...analytics.options.sentryData,
                  data: {
                    ...analytics.options.sentryData?.data,
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
