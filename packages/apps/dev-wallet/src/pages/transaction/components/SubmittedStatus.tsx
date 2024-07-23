import { ITransaction } from '@/modules/transaction/transaction.repository';
import { parseAsPactValue } from '@kadena/client';
import { MonoBrightness1 } from '@kadena/kode-icons/system';
import { Button, Heading, Stack, Text } from '@kadena/kode-ui';
import classNames from 'classnames';
import { Value } from './helpers';
import {
  codeClass,
  failureClass,
  pendingClass,
  pendingText,
  successClass,
} from './style.css';

export function SubmittedStatus({
  transaction,
}: {
  transaction: ITransaction;
}) {
  if (!transaction.request?.requestKey) {
    return <Text>Request Key not found</Text>;
  }
  if (transaction.preflight.result.status !== 'success') {
    return <Text>Preflight failed</Text>;
  }
  const status = transaction.status;
  return (
    <Stack flexDirection={'column'} gap={'lg'}>
      <Heading variant="h4">Transaction Status</Heading>
      <Stack gap={'sm'} flexDirection={'column'}>
        <Heading variant="h6">Request Key</Heading>
        <Value className={codeClass}>{transaction.request.requestKey}</Value>
      </Stack>
      <Stack gap={'sm'} flexDirection={'column'}>
        <Heading variant="h6">Preflight Result</Heading>
        <Value className={codeClass}>
          {parseAsPactValue(transaction.preflight.result.data)}
        </Value>
      </Stack>
      <Stack gap={'sm'} flexDirection={'column'}>
        <Heading variant="h6">Transaction Status</Heading>
        <Stack gap={'sm'} alignItems={'center'}>
          <MonoBrightness1 className={successClass} />{' '}
          <Text>Transaction sent to mempool</Text>
        </Stack>
        <Stack gap={'sm'} alignItems={'center'}>
          <MonoBrightness1
            className={classNames(
              status === 'success' && successClass,
              status === 'failure' && failureClass,
              status === 'submitted' && pendingClass,
            )}
          />{' '}
          <Text className={classNames(status === 'submitted' && pendingText)}>
            Transaction successfully mined
          </Text>
        </Stack>
      </Stack>
      {transaction.result && transaction.result.result.status === 'success' && (
        <Stack gap={'sm'} flexDirection={'column'}>
          <Heading variant="h6">Transaction Result</Heading>
          <Value className={codeClass}>
            {parseAsPactValue(transaction.result.result.data)}
          </Value>
        </Stack>
      )}
      <Stack>
        {transaction.result && (
          <Button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(transaction.result));
            }}
          >
            Copy result
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
