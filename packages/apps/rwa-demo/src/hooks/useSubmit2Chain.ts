import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type {
  ITransaction,
  ITxType,
} from '@/contexts/TransactionsContext/TransactionsContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import { interpretErrorMessage } from '@/providers/TransactionsProvider/TransactionsProvider';
import type { IAnalyticsEventType } from '@/utils/analytics';
import { getClient } from '@/utils/client';
import type { ITransactionDescriptor, IUnsignedCommand } from '@kadena/client';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useNotifications } from './notifications';
import { useTransactions } from './transactions';

interface IOptions {
  notificationSentryName: IAnalyticsEventType;
  skipAssetCheck?: boolean;
  successMessage?: string;
  chainFunction: (
    account: IWalletAccount,
    asset: IAsset,
  ) => Promise<IUnsignedCommand | undefined>;
  transaction: {
    accounts: string[];
    type: ITxType;
  };
}

export const useSubmit2Chain = () => {
  const { account, sign } = useAccount();
  const { addTransaction, showTransactionDialog, hideTransactionDialog } =
    useTransactions();
  const { asset } = useAsset();
  const { addNotification } = useNotifications();

  const submit2Chain = async <T>(
    data: T,
    options: IOptions,
  ): Promise<ITransaction | undefined> => {
    if (!asset && !options.skipAssetCheck) {
      addNotification(
        {
          intent: 'negative',
          label: 'asset not found',
          message: '',
        },
        {
          name: options.notificationSentryName,
          options: {
            message: 'asset not found',
            sentryData: {
              type: 'submit_chain',
            },
          },
        },
      );
      return;
    }

    let res: ITransactionDescriptor | undefined = undefined;
    let tx: IUnsignedCommand | undefined = undefined;
    try {
      showTransactionDialog();
      tx = await options.chainFunction(account!, asset!);

      if (!tx) {
        addNotification(
          {
            intent: 'negative',
            label: 'transaction not created',
            message:
              'The transaction could not be created. Please check the data provided.',
          },
          {
            name: options.notificationSentryName,
            options: {
              message: 'Transaction not created',
              sentryData: {
                type: 'submit_chain',
                captureContext: {
                  extra: {
                    data,
                  },
                },
              },
            },
          },
        );
        return;
      }

      const signedTransaction = await sign(tx);
      console.log(1111, signedTransaction);
      if (!signedTransaction) return;

      const client = getClient();
      res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        ...options.transaction,
        successMessage: options.successMessage ?? '',
      });
    } catch (e: any) {
      addNotification(
        {
          intent: 'negative',
          label: 'there was an error',
          message: interpretErrorMessage(e.message),
        },
        {
          name: options.notificationSentryName,
          options: {
            message: interpretErrorMessage(e.message),
            sentryData: {
              type: 'submit_chain',
              captureContext: {
                extra: {
                  tx,
                  data,
                  res,
                },
              },
            },
          },
        },
      );
    } finally {
      hideTransactionDialog();
    }
  };

  return { submit2Chain };
};
