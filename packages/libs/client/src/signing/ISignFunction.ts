import { ICommand, IUnsignedCommand } from '@kadena/types';

export interface ISignFunction {
  (transaction: IUnsignedCommand): Promise<ICommand | IUnsignedCommand>;
  (
    transactionList: IUnsignedCommand[],
  ): Promise<(ICommand | IUnsignedCommand)[]>;
}

export interface ISignSingleFunction {
  (transaction: IUnsignedCommand): Promise<ICommand | IUnsignedCommand>;
}
