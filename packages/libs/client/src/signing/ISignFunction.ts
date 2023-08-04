import { ICommand, IUnsignedCommand } from '@kadena/types';

/**
 * Interface to use when writing a singing function that accepts multiple transactions
 * @public
 */
export interface ISingleSignFunction {
  (transaction: IUnsignedCommand): Promise<ICommand | IUnsignedCommand>;
}

/**
 * Interface to use when writing a singing function that accepts multiple transactions
 * @public
 */
export interface ISignFunction extends ISingleSignFunction {
  (
    transactionList: IUnsignedCommand[],
  ): Promise<(ICommand | IUnsignedCommand)[]>;
}
