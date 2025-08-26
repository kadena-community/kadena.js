import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import {
  Heading,
  maskValue,
  Notification,
  NotificationHeading,
} from '@kadena/kode-ui';
import type { FC } from 'react';

interface IProps {
  transaction: ITransaction;
  onDismiss: (tx: ITransaction) => void;
}

export const ActiveTransaction: FC<IProps> = ({ transaction, onDismiss }) => {
  return (
    <li>
      <Notification
        role="status"
        intent="info"
        type="inlineStacked"
        isDismissable
        onDismiss={() => {
          onDismiss(transaction);
        }}
      >
        <NotificationHeading>{transaction.type.name}</NotificationHeading>
        <Heading as="h6">Accounts</Heading>
        {transaction.accounts?.map((account) => (
          <li key={account}>{maskValue(account)}</li>
        ))}
      </Notification>
    </li>
  );
};
