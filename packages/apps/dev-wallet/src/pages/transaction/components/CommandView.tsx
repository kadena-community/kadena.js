import { CopyButton } from '@/Components/CopyButton/CopyButton';
import { ITransaction } from '@/modules/transaction/transaction.repository';
import { shorten, toISOLocalDateTime } from '@/utils/helpers';
import { shortenPactCode } from '@/utils/parsedCodeToPact';
import { IPactCommand } from '@kadena/client';
import { MonoTextSnippet } from '@kadena/kode-icons/system';
import { Button, Card, Stack, Text } from '@kadena/kode-ui';
import { CardContentBlock } from '@kadena/kode-ui/patterns';
import classNames from 'classnames';
import { useMemo, useState } from 'react';
import { Label, Value } from './helpers';
import { cardClass, codeClass, textEllipsis } from './style.css';

export function CommandView({ transaction }: { transaction: ITransaction }) {
  const command: IPactCommand = useMemo(
    () => JSON.parse(transaction.cmd),
    [transaction.cmd],
  );

  const [showShortenCode, setShowShortenCode] = useState(true);
  return (
    <Stack flexDirection={'column'} gap={'lg'}>
      {'exec' in command.payload && (
        <>
          <Card fullWidth>
            <CardContentBlock
              title="Code"
              supportingContent={
                <Button
                  onPress={() => setShowShortenCode(!showShortenCode)}
                  variant={'transparent'}
                  isCompact
                  startVisual={<MonoTextSnippet />}
                />
              }
            >
              <Stack width="100%">
                <Text variant="code" size="smallest" className={codeClass}>
                  {showShortenCode ? (
                    <pre>{shortenPactCode(command.payload.exec.code)}</pre>
                  ) : (
                    command.payload.exec.code
                  )}
                </Text>
              </Stack>
            </CardContentBlock>
          </Card>

          {Object.keys(command.payload.exec.data).length > 0 && (
            <Card fullWidth>
              <CardContentBlock title="Data">
                <Text variant="code" size="smallest" className={codeClass}>
                  <pre>
                    {JSON.stringify(command.payload.exec.data, null, 2)}
                  </pre>
                </Text>
              </CardContentBlock>
            </Card>
          )}
        </>
      )}
      {'cont' in command.payload && (
        <>
          <Card fullWidth>
            <CardContentBlock title="Continuation">
              <Value>
                {command.payload.cont.pactId}- step(
                {command.payload.cont.step})
              </Value>
            </CardContentBlock>
          </Card>

          {Object.keys(command.payload.cont.data || {}).length > 0 && (
            <Card fullWidth>
              <CardContentBlock title="Data">
                <pre className={codeClass}>
                  {JSON.stringify(command.payload.cont.data, null, 2)}
                </pre>
              </CardContentBlock>
            </Card>
          )}
          {command.payload.cont.proof && (
            <Card fullWidth>
              <CardContentBlock
                title="Proof"
                supportingContent={
                  <CopyButton data={command.payload.cont.proof} />
                }
              >
                <Text
                  variant="code"
                  className={classNames(codeClass, textEllipsis)}
                >
                  {shorten(command.payload.cont.proof, 40)}
                </Text>
              </CardContentBlock>
            </Card>
          )}
        </>
      )}
      <Card fullWidth>
        <CardContentBlock title="Metadata">
          <Stack flexDirection={'column'}>
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
                {toISOLocalDateTime(command.meta.creationTime! * 1000)})
              </Value>
            </Stack>
            <Stack gap={'sm'}>
              <Label>TTL</Label>
              <Value>
                {command.meta.ttl} (
                {toISOLocalDateTime(
                  (command.meta.ttl! + command.meta.creationTime!) * 1000,
                )}
                )
              </Value>
            </Stack>
            <Stack gap={'sm'}>
              <Label>Nonce</Label>
              <Value>{command.nonce}</Value>
            </Stack>
          </Stack>
        </CardContentBlock>
      </Card>

      <Card fullWidth>
        <CardContentBlock title="Gas Info">
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
        </CardContentBlock>
      </Card>
    </Stack>
  );
}
