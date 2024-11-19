import { useAccount } from '@/hooks/account';
import { useGetAgents } from '@/hooks/getAgents';
import { removeAgent } from '@/services/removeAgent';
import { getClient } from '@/utils/client';
import { MonoDelete } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import { CompactTable, CompactTableFormatters } from '@kadena/kode-ui/patterns';
import type { FC } from 'react';

export const AgentsList: FC = () => {
  const { data } = useGetAgents();
  const { account, sign } = useAccount();

  const handleDelete = async (accountName: any) => {
    try {
      const tx = await removeAgent({ agent: accountName }, account!);

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      await client.listen(res);
      console.log('DONE');
    } catch (e: any) {}
  };

  console.log({ data });
  return (
    <CompactTable
      fields={[
        {
          label: 'status',
          key: 'result',
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
      data={data}
    />
  );
};
