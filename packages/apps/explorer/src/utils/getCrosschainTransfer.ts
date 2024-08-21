import type {
  TransactionMempoolInfo,
  TransactionRequestKeyQuery,
  Transfer,
} from '@/__generated__/sdk';

type TransactionMempoolOrResult = Exclude<
  TransactionRequestKeyQuery['transaction'],
  undefined | null
>['result'];

type TxResult = Exclude<TransactionMempoolOrResult, TransactionMempoolInfo>;

export const getCrosschainTransfer = (transaction: TxResult): Transfer => {
  return transaction.transfers.edges.find(
    (edge) => edge?.node.crossChainTransfer !== null,
  )?.node.crossChainTransfer as Transfer;
};
