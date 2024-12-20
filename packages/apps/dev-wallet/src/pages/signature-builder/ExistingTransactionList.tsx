import { ITransaction } from '@/modules/transaction/transaction.repository';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate';
import {
  MonoCheck,
  MonoRemoveCircleOutline,
  MonoSignature,
} from '@kadena/kode-icons/system';
import { Box, Stack, Text } from '@kadena/kode-ui';
import React from 'react';
import { TxTileGeneric } from '../transaction-group/components/TxTileGeneric';
import { successClass } from '../transaction-group/components/style.css';

interface ExistingTransactionListProps {
  transactions: ITransaction[];
  onRemove: (tx: ITransaction) => void;
}

export const ExistingTransactionList: React.FC<
  ExistingTransactionListProps
> = ({ transactions, onRemove }) => {
  const navigate = usePatchedNavigate();

  if (transactions.length === 0) return null;

  return (
    <Box>
      {transactions.map((tx) => (
        <TxTileGeneric
          key={tx.uuid}
          tx={tx}
          subtexts={[
            () => (
              <Text size={'smallest'} className={successClass}>
                <Stack alignItems={'center'} gap={'xs'}>
                  <MonoCheck />
                  Already present in wallet
                </Stack>
              </Text>
            ),
          ]}
          buttons={[
            {
              label: 'Discard',
              Icon: () => <MonoRemoveCircleOutline />,
              onClick: () => onRemove(tx),
              position: 'flex-start',
            },
            {
              label: 'Open',
              onClick: () => navigate(`/transaction-group/${tx.groupId}`),
              Icon: () => <MonoSignature />,
              position: 'flex-end',
            },
          ]}
        />
      ))}
    </Box>
  );
};
