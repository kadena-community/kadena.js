import { useAccount } from '@/hooks/account';
import { useGetAgents } from '@/hooks/getAgents';
import { useNetwork } from '@/hooks/networks';
import { removeAgent } from '@/services/removeAgent';
import { getClient } from '@/utils/client';
import { MonoDelete } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import { CompactTable, CompactTableFormatters } from '@kadena/kode-ui/patterns';
import type { FC } from 'react';

export const AgentsList: FC = () => {
  const { data } = useGetAgents();
  const { account, sign } = useAccount();
  const { activeNetwork } = useNetwork();

  const handleDelete = async (accountName: any) => {
    try {
      const tx = await removeAgent(
        { agent: accountName },
        activeNetwork,
        account!,
      );

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      console.log({ cmd: JSON.parse(signedTransaction.cmd) });
      const client = getClient();
      const res = await client.submit(signedTransaction);

      await client.listen(res);
      console.log(111, { res });
      console.log('DONE');
    } catch (e: any) {}
  };
  return (
    <CompactTable
      fields={[
        { label: 'Account', key: 'accountName', width: '50%' },
        { label: 'Requestkey', key: 'requestKey', width: '30%' },
        {
          label: '',
          key: 'accountName',
          width: '20%',
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
