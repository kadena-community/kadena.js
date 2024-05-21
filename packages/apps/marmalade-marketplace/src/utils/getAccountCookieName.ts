import { ACCOUNT_COOKIE_NAME } from '@/constants';
import { env } from './env';

export const getAccountCookieName = () => {
  return `${ACCOUNT_COOKIE_NAME}_${env.NETWORKID}`;
};
