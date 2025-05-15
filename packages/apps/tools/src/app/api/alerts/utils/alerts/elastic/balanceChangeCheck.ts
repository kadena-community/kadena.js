import type { IAlert } from './../../constants';
import { balanceCheck } from './balanceCheck';

export const balanceChangeCheck = async (alert: IAlert): Promise<string[]> => {
  return balanceCheck(alert);
};
