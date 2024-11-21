import type { IDistributeTokensProps } from '@/services/distributeTokens';
import { distributeTokens } from '@/services/distributeTokens';
import { getClient } from '@/utils/client';
import { useState } from 'react';
import { useAccount } from './account';
import { useTransactions } from './transactions';

export const useDistributeTokens = () => {
  const [error, setError] = useState<string | null>(null);
  const { account, sign } = useAccount();
  const { addTransaction } = useTransactions();

  const submit = async (data: IDistributeTokensProps) => {
    setError(null);
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
      });

      console.log({ res });
      console.log('DONE');
    } catch (e: any) {
      setError(e?.message || e);
    }
  };

  return { submit, error };
};
