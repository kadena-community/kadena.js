import { useAccount } from '@/hooks/account';
import { useGetInvestors } from '@/hooks/getInvestors';
import { deleteIdentity } from '@/services/deleteIdentity';
import { getClient } from '@/utils/client';
import { MonoDelete } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import { CompactTable, CompactTableFormatters } from '@kadena/kode-ui/patterns';
import Link from 'next/link';
import type { FC } from 'react';

export const InvestorList: FC = () => {
  const { data } = useGetInvestors();
  const { account, sign } = useAccount();

  const handleDelete = async (accountName: any) => {
    try {
      const tx = await deleteIdentity({ investor: accountName }, account!);

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      console.log(res);
      await client.listen(res);
      console.log('DONE');
    } catch (e: any) {}
  };

  return (
    <CompactTable
      fields={[
        {
          label: 'status',
          key: 'result',
          width: '10%',
          render: CompactTableFormatters.FormatStatus(),
        },
        {
          label: 'Account',
          key: 'accountName',
          width: '50%',
          render: CompactTableFormatters.FormatLinkWrapper({
            url: '/investors/:value',
            linkComponent: Link,
          }),
        },
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
