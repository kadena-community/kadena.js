import { useAccount } from '@/hooks/account';
import { useGetAgents } from '@/hooks/getAgents';
import { useNetwork } from '@/hooks/networks';
import { useTransactions } from '@/hooks/transactions';
import { removeAgent } from '@/services/removeAgent';
import { getClient } from '@/utils/client';
import { MonoDelete } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import { CompactTable, CompactTableFormatters } from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import type { ITransaction } from '../TransactionsProvider/TransactionsProvider';

export const AgentsList: FC = () => {
  const [innerData, setInnerData] = useState<any[]>([]);
  const { data } = useGetAgents();
  const { account, sign } = useAccount();
  const { activeNetwork } = useNetwork();
  const { getTransactions, transactions } = useTransactions();

  const handleDelete = async (accountName: any) => {
    try {
      const tx = await removeAgent(
        { agent: accountName },
        activeNetwork,
        account!,
      );

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      await client.listen(res);
      console.log('DONE');
    } catch (e: any) {}
  };

  const initInnerData = async (transactions: ITransaction[]) => {
    const promises = transactions.map(async (t) => {
      const result = await t.listener;

      return {
        requestKey: t.requestKey,
        accountName: t.data.agent,
        result: result?.result,
      };
    });

    const data = await Promise.all(promises);

    setInnerData(data);
  };

  useEffect(() => {
    const tx = getTransactions('ADDAGENT');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initInnerData(tx);
  }, [transactions]);

  console.log({ innerData });
  return (
    <CompactTable
      fields={[
        {
          label: 'status',
          key: 'result.data',
          width: '10%',
          render: CompactTableFormatters.FormatStatus(),
        },
        { label: 'Account', key: 'accountName', width: '50%' },
        { label: 'Requestkey', key: 'requestKey', width: '30%' },
        {
          label: '',
          key: 'accountName',
          width: '10%',
          render: CompactTableFormatters.FormatActions({
            trigger: (
              <Button startVisual={<MonoDelete />} onPress={handleDelete} />
            ),
          }),
        },
      ]}
      data={[...data, ...innerData]}
    />
  );
};
