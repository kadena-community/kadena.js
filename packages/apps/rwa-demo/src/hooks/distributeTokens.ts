import type { IDistributeTokensProps } from '@/services/distributeTokens';
import { distributeTokens } from '@/services/distributeTokens';
import { getClient } from '@/utils/client';
import { useAccount } from './account';
import { useTransactions } from './transactions';

export const useDistributeTokens = () => {
  const { account, sign } = useAccount();
  const { addTransaction } = useTransactions();

  const submit = async (data: IDistributeTokensProps) => {
    try {
      const tx = await distributeTokens(data, account!);

      console.log(tx);
      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      addTransaction({
        ...res,
        type: 'DISTRIBUTETOKENS',
        data: { ...res, ...data },
        tx: signedTransaction,
      });

      console.log({ res });
      console.log('DONE');
    } catch (e: any) {}
  };

  return { submit };
};
