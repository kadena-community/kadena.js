import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { Heading, maskValue, Stack, Tile } from '@kadena/kode-ui';
import type { FC } from 'react';

interface IProps {
  transaction: ITransaction;
}

export const ActiveTransaction: FC<IProps> = ({ transaction }) => {
  return (
    <li>
      <Tile>
        <Stack flexDirection="column" width="100%" gap="md">
          {transaction.type.name}

          <Heading as="h6">Accounts</Heading>
          {transaction.accounts?.map((account) => (
            <li key={account}>{maskValue(account)}</li>
          ))}
        </Stack>
      </Tile>
    </li>
  );
};
