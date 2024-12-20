import { ITransaction } from '@/modules/transaction/transaction.repository';
import { MonoRemoveCircleOutline } from '@kadena/kode-icons/system';
import { Box, Stack, Text } from '@kadena/kode-ui';
import React from 'react';
import { TxTileGeneric } from '../transaction-group/components/TxTileGeneric';

interface TransactionListProps {
  transactions: ITransaction[];
  onRemove: (tx: ITransaction) => void;
  title?: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onRemove,
  title = 'Transactions to review',
}) => {
  if (transactions.length === 0) return null;

  return (
    <Stack flexDirection={'row'} gap={'sm'}>
      <Box>
        <Text>{title}</Text>
        {transactions.map((tx) => (
          <TxTileGeneric
            key={tx.uuid}
            tx={tx}
            buttons={[
              {
                label: 'Discard',
                Icon: () => <MonoRemoveCircleOutline />,
                onClick: () => onRemove(tx),
                position: 'flex-start',
              },
            ]}
          />
        ))}
      </Box>
    </Stack>
  );
};
