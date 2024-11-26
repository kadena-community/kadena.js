import type { ISetComplianceProps } from '@/services/setCompliance';
import { setCompliance } from '@/services/setCompliance';
import { getClient } from '@/utils/client';
import { useState } from 'react';
import { useAccount } from './account';
import { useTransactions } from './transactions';

export const useSetCompliance = () => {
  const [error, setError] = useState<string | null>(null);
  const { account, sign } = useAccount();
  const { addTransaction } = useTransactions();

  const submit = async (data: ISetComplianceProps) => {
    setError(null);
    try {
      const tx = await setCompliance(data, account!);

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      await addTransaction({
        ...res,
        type: 'SETCOMPLIANCE',
      });

      console.log({ res });
      console.log('DONE');
    } catch (e: any) {
      setError(e?.message || e);
    }
  };

  return { submit, error };
};
