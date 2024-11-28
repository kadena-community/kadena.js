import { useDeleteInvestor } from '@/hooks/deleteInvestor';
import { useGetInvestors } from '@/hooks/getInvestors';
import { MonoDelete } from '@kadena/kode-icons';
import { Button, Heading } from '@kadena/kode-ui';
import { CompactTable, CompactTableFormatters } from '@kadena/kode-ui/patterns';
import Link from 'next/link';
import type { FC } from 'react';

export const InvestorList: FC = () => {
  const { data } = useGetInvestors();
  const { submit } = useDeleteInvestor();

  const handleDelete = async (accountName: any) => {
    return await submit({ investor: accountName });
  };

  return (
    <>
      <Heading as="h3">Investors</Heading>
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
    </>
  );
};
