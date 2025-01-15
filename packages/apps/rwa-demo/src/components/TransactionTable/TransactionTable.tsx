import { useInvestorTransactions } from '@/hooks/investorTransactions';
import type { IRecord } from '@/utils/filterRemovedRecords';
import { loadingData } from '@/utils/loadingData';
import { CompactTable, CompactTableFormatters } from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { FormatAmount } from '../TableFormatters/FormatAmount';
import { FormatDate } from '../TableFormatters/FormatDate';

interface IProps {
  investor: IRecord;
}

export const TransactionTable: FC<IProps> = ({ investor }) => {
  const { data, loading } = useInvestorTransactions({
    investorAccount: investor.accountName,
  });

  return (
    <CompactTable
      isLoading={loading}
      fields={[
        {
          key: 'amount',
          label: 'Amount (tokens)',
          width: '20%',
          align: 'end',
          render: FormatAmount(),
        },
        {
          key: 'toAccount',
          label: 'To',
          width: '20%',
          render: CompactTableFormatters.FormatAccount(),
        },
        {
          key: 'fromAccount',
          label: 'From',
          width: '20%',
          render: CompactTableFormatters.FormatAccount(),
        },
        {
          key: 'creationTime',
          label: 'Date',
          width: '20%',
          align: 'end',
          render: FormatDate(),
        },
      ]}
      data={
        loading
          ? loadingData
          : data.sort((a, b) => {
              if (a.creationTime < b.creationTime) return -1;
              return 1;
            })
      }
    />
  );
};
