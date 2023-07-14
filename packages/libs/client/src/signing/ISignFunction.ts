import { ICommand, IUnsignedCommand } from '@kadena/types';

export interface ISignFunction {
  (...transactions: IUnsignedCommand[]): Promise<
    (ICommand | IUnsignedCommand)[]
  >;
}

export interface ISignSingleFunction {
  (transaction: IUnsignedCommand): Promise<ICommand | IUnsignedCommand>;
}
