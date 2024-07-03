import { IPactCommand, IUnsignedCommand } from '@kadena/client';
import { Heading, Stack, Text } from '@kadena/react-ui';
import { FC, PropsWithChildren, useMemo } from 'react';
import {
  cardClass,
  codeClass,
  containerClass,
  labelClass,
} from './style.css.ts';

import { Signers } from './Signers.tsx';

const Label: FC<PropsWithChildren> = ({ children }) => (
  <Text className={labelClass}>{children}</Text>
);

const Value: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <Text bold variant="code" className={className}>
    {children}
  </Text>
);

export function ReviewTransaction({
  transaction,
}: {
  transaction: IUnsignedCommand;
}) {
  const command: IPactCommand = useMemo(
    () => JSON.parse(transaction.cmd),
    [transaction.cmd],
  );
  return (
    <Stack flexDirection={'column'} className={containerClass}>
      <Heading>Confirm Transaction</Heading>
      <Stack flexDirection={'column'} gap={'xl'}>
        <Stack gap={'sm'} flexDirection={'column'}>
          <Heading variant="h4">hash (request-key)</Heading>
          <Value className={codeClass}>{transaction.hash}</Value>
        </Stack>
        {'exec' in command.payload && (
          <Stack gap={'sm'} flexDirection={'column'}>
            <Heading variant="h4">Code</Heading>
            <Value className={codeClass}>{command.payload.exec.code}</Value>
          </Stack>
        )}
        {'cont' in command.payload && (
          <Stack gap={'sm'} flexDirection={'column'}>
            <Heading variant="h4">Continuation</Heading>
            <Value>
              {command.payload.cont.pactId}- step({command.payload.cont.step})
            </Value>
          </Stack>
        )}
        <Stack gap={'sm'} flexDirection={'column'}>
          <Heading variant="h4">Transaction Metadata</Heading>
          <Stack flexDirection={'column'} className={cardClass}>
            <Stack gap={'sm'}>
              <Label>Network</Label>
              <Value>{command.networkId}</Value>
            </Stack>
            <Stack gap={'sm'}>
              <Label>Chain</Label>
              <Value>{command.meta.chainId}</Value>
            </Stack>
            <Stack gap={'sm'}>
              <Label>Creation time</Label>
              <Value>
                {command.meta.creationTime} (
                {new Date(command.meta.creationTime! * 1000).toLocaleString()})
              </Value>
            </Stack>
            <Stack gap={'sm'}>
              <Label>TTL</Label>
              <Value>
                {command.meta.ttl} (
                {new Date(
                  (command.meta.ttl! + command.meta.creationTime!) * 1000,
                ).toLocaleString()}
                )
              </Value>
            </Stack>
            <Stack gap={'sm'}>
              <Label>Nonce</Label>
              <Value>{command.nonce}</Value>
            </Stack>
          </Stack>
        </Stack>
        <Stack gap={'sm'} flexDirection={'column'}>
          <Heading variant="h4">Gas Info</Heading>
          <Stack flexDirection={'column'} className={cardClass}>
            <Stack gap={'sm'}>
              <Label>Gas Payer</Label>
              <Value>{command.meta.sender}</Value>
            </Stack>
            <Stack gap={'sm'}>
              <Label>Gas Price</Label>
              <Value>{command.meta.gasPrice}</Value>
            </Stack>
            <Stack gap={'sm'}>
              <Label>Gas Limit</Label>
              <Value>{command.meta.gasLimit}</Value>
            </Stack>
            <Stack gap={'sm'}>
              <Label>Max Gas Cost</Label>
              <Value>
                {command.meta.gasLimit! * command.meta.gasPrice!} KDA
              </Value>
            </Stack>
          </Stack>
        </Stack>
        <Signers transaction={transaction} />
      </Stack>
    </Stack>
  );
}
