import type { IAlert } from './constants';
import { elasticAlerts, slackAlerts } from './constants';

const runJob = (alert: IAlert, funcs: typeof slackAlerts) => {
  if (!funcs[alert.messageType]) {
    throw new Error(`message function ${alert.messageType} not found`);
  }

  return funcs[alert.messageType](alert);
};

export const getAllAlertPromises = (
  alerts: IAlert[],
  isElasticAlerts?: boolean,
): Promise<string[][]> => {
  if (isElasticAlerts) {
    const promises = alerts.map((alert) => runJob(alert, elasticAlerts));
    return Promise.all(promises);
  }

  const promises = alerts.map((alert) => runJob(alert, slackAlerts));
  return Promise.all(promises);
};
