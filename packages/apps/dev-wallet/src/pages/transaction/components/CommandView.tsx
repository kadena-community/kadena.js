import { CopyButton } from '@/Components/CopyButton/CopyButton';
import { ITransaction } from '@/modules/transaction/transaction.repository';
import { shortenPactCode } from '@/utils/parsedCodeToPact';
import { IPactCommand } from '@kadena/client';
import { MonoTextSnippet } from '@kadena/kode-icons/system';
import { Button, Heading, Stack, Text } from '@kadena/kode-ui';
import classNames from 'classnames';
import { useMemo, useState } from 'react';
import { Label, Value } from './helpers';
import { Signers } from './Signers';
import { cardClass, codeClass, textEllipsis } from './style.css';

export function CommandView({
  transaction,
  onSign,
}: {
  transaction: ITransaction;
  onSign: (sig: ITransaction['sigs']) => void;
}) {
  const command: IPactCommand = useMemo(
    () => JSON.parse(transaction.cmd),
    [transaction.cmd],
  );
  const [showShortenCode, setShowShortenCode] = useState(true);
  return (
    <Stack flexDirection={'column'} gap={'xl'}>
      <Stack gap={'sm'} flexDirection={'column'}>
        <Heading variant="h4">hash (request-key)</Heading>

        <Value className={codeClass}>{transaction.hash}</Value>
      </Stack>
      {'exec' in command.payload && (
        <>
          <Stack gap={'sm'} flexDirection={'column'}>
            <Stack gap={'sm'} justifyContent={'space-between'}>
              <Heading variant="h4">Code</Heading>
              <Button
                onPress={() => setShowShortenCode(!showShortenCode)}
                variant={'transparent'}
                isCompact
                startVisual={<MonoTextSnippet />}
              />
            </Stack>
            <Value className={codeClass}>
              {showShortenCode ? (
                <pre>{shortenPactCode(command.payload.exec.code)}</pre>
              ) : (
                command.payload.exec.code
              )}
            </Value>
          </Stack>
          {Object.keys(command.payload.exec.data).length > 0 && (
            <Stack gap={'sm'} flexDirection={'column'}>
              <Heading variant="h4">Data</Heading>
              <pre className={codeClass}>
                {JSON.stringify(command.payload.exec.data, null, 2)}
              </pre>
            </Stack>
          )}
        </>
      )}
      {'cont' in command.payload && (
        <>
          <Stack gap={'sm'} flexDirection={'column'}>
            <Heading variant="h4">Continuation</Heading>
            <Value>
              {command.payload.cont.pactId}- step(
              {command.payload.cont.step})
            </Value>
          </Stack>
          {Object.keys(command.payload.cont.data || {}).length > 0 && (
            <Stack gap={'sm'} flexDirection={'column'}>
              <Heading variant="h4">Data</Heading>
              <pre className={codeClass}>
                {JSON.stringify(command.payload.cont.data, null, 2)}
              </pre>
            </Stack>
          )}
          {command.payload.cont.proof && (
            <Stack gap={'sm'} flexDirection={'column'}>
              <Stack justifyContent={'space-between'}>
                <Heading variant="h4">Proof</Heading>
                <CopyButton data={command.payload.cont.proof} />
              </Stack>
              <Text
                variant="code"
                className={classNames(codeClass, textEllipsis)}
              >
                {command.payload.cont.proof}
              </Text>
            </Stack>
          )}
        </>
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
            <Value>{command.meta.gasLimit! * command.meta.gasPrice!} KDA</Value>
          </Stack>
        </Stack>
      </Stack>
      <Signers transaction={transaction} onSign={onSign} />
    </Stack>
  );
}
