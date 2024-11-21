import type { ITransferTokensProps } from '@/services/transferTokens';
import { transferTokens } from '@/services/transferTokens';
import { getClient } from '@/utils/client';
import { useAccount } from './account';
import { useTransactions } from './transactions';

export const useTransferTokens = () => {
  const { account, sign } = useAccount();
  const { addTransaction } = useTransactions();

  const submit = async (data: ITransferTokensProps) => {
    try {
      const tx = await transferTokens(data, account!);

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
    } catch (e: any) {}
  };

  return { submit };
};
