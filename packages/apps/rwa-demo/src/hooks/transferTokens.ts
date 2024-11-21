import type { ITransferTokensProps } from '@/services/transferTokens';
import { transferTokens } from '@/services/transferTokens';
import { getClient } from '@/utils/client';
import type { IUnsignedCommand } from '@kadena/client';
import { useAccount } from './account';
import { useTransactions } from './transactions';

export const useTransferTokens = () => {
  const { account, sign } = useAccount();
  const { addTransaction } = useTransactions();

  const createTx = async (
    data: ITransferTokensProps,
  ): Promise<IUnsignedCommand | undefined> => {
    const tx = await transferTokens(data, account!);

    return tx;
  };

  const submit = async (unsignedTransaction: IUnsignedCommand) => {
    try {
      const signedTransaction = await sign(unsignedTransaction);
      if (!signedTransaction) return;
      const client = getClient();
      const res = await client.submit(signedTransaction);

      addTransaction({
        ...res,
        type: 'TRANSFERTOKENS',
        data: { ...res },
      });

      console.log({ res });
      console.log('DONE');
    } catch (e: any) {}
  };

  return { submit, createTx };
};
