import type { IAlert } from './constants';

export const getAllAlertPromises = (
  alerts: IAlert[],
  isElasticAlerts?: boolean,
): Promise<string[][]> => {
  if (isElasticAlerts) {
    const promises = alerts
      .map((alert) => {
        if (alert.messageType.elastic) {
          return alert.messageType.elastic(alert);
        }

        return;
      })
      .filter(Boolean);

    return Promise.all(promises);
  }

  const promises = alerts
    .map((alert) => {
      if (alert.messageType.slack) {
        return alert.messageType.slack(alert);
      }

      return;
    })
    .filter(Boolean);
  return Promise.all(promises);
};
