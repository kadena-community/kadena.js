import { ICommand, IUnsignedCommand } from '@kadena/types';

import { PactCommand } from '../../pact';

export interface ISignFunction {
  (...transactions: PactCommand[]): Promise<(ICommand | IUnsignedCommand)[]>;
}

export interface ISignSingleFunction {
  (transaction: PactCommand): Promise<ICommand | IUnsignedCommand>;
}
