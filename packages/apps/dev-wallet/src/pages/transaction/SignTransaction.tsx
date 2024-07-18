import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';
import { Button, Heading, Stack } from '@kadena/kode-ui';
import { isSignedCommand } from '@kadena/pactjs';
import { ReviewTransaction } from './components/ReviewTransaction';

export function SignTransaction({
  transaction,
  patchTransaction,
}: {
  transaction: ITransaction;
  patchTransaction: (tx: Partial<ITransaction>) => void;
}) {
  return (
    <Stack flexDirection={'column'} gap={'xl'}>
      <Heading variant="h4">Status: {transaction?.status || 'UNKNOWN'}</Heading>
      <ReviewTransaction
        transaction={transaction}
        onSign={(sigs) => {
          patchTransaction({
            sigs,
          });
        }}
      />
      <Stack gap={'sm'} flex={1}>
        <Button
          onClick={() => {
            patchTransaction({ status: 'signed' });
          }}
          isDisabled={!isSignedCommand(transaction)}
        >
          Submit
        </Button>
        <Button
          variant="transparent"
          onClick={() => {
            transactionRepository.deleteTransaction(transaction.uuid);
          }}
        >
          Reject
        </Button>
      </Stack>
    </Stack>
  );
}
