import { env } from './env';

export const getLocalStorageKey = (key: string): string => {
  return `${env.NETWORKID}-${key}`;
};
