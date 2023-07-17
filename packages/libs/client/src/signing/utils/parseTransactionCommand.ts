import { ICommand, IUnsignedCommand } from '@kadena/types';

import { IPactCommand } from '../../interfaces/IPactCommand';

export const parseTransactionCommand: (
  transaction: IUnsignedCommand | ICommand,
) => IPactCommand = (transaction) => {
  return JSON.parse(transaction.cmd);
};
