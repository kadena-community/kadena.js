import { CopyButton } from '@/Components/CopyButton/CopyButton';
import { ErrorBoundary } from '@/Components/ErrorBoundary/ErrorBoundary';
import { ITransaction } from '@/modules/transaction/transaction.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten, toISOLocalDateTime } from '@/utils/helpers';
import { shortenPactCode } from '@/utils/parsedCodeToPact';
import { IPactCommand } from '@kadena/client';
import { MonoTextSnippet } from '@kadena/kode-icons/system';
import {
  Button,
  Card,
  Heading,
  Notification,
  Stack,
  Text,
} from '@kadena/kode-ui';
import { CardContentBlock } from '@kadena/kode-ui/patterns';
import { execCodeParser } from '@kadena/pactjs-generator';
import classNames from 'classnames';
import { useMemo, useState } from 'react';
import { CodeView } from './code-components/CodeView';
import { Label, Value } from './helpers';
import { RenderSigner } from './Signer';
import { cardClass, codeClass, textEllipsis } from './style.css';

export function CommandView({
  transaction,
  onSign,
}: {
  transaction: ITransaction;
  onSign: (sig: ITransaction['sigs']) => void;
}) {
  const { getPublicKeyData } = useWallet();
  const command: IPactCommand = useMemo(
    () => JSON.parse(transaction.cmd),
    [transaction.cmd],
  );
  const signers = useMemo(
    () =>
      command.signers.map((signer) => {
        const info = getPublicKeyData(signer.pubKey);
        return {
          ...signer,
          info,
        };
      }),
    [command, getPublicKeyData],
  );

  const parsedCode = useMemo(() => {
    if ('exec' in command.payload) {
      return execCodeParser(command.payload.exec.code);
    }
    return [];
  }, [command.payload]);

  const externalSigners = signers.filter((signer) => !signer.info);
  const internalSigners = signers.filter((signer) => signer.info);
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
      <Stack flexDirection={'column'} gap={'xxl'}>
        <Stack
          title="Your Signatures"
          key={'your-signatures'}
          flexDirection={'column'}
          gap={'sm'}
        >
          <Heading variant="h4">Your Signatures</Heading>
          {internalSigners.length === 0 && (
            <Notification intent="info" role="status">
              Nothing to sign by you
            </Notification>
          )}
          {internalSigners.map((signer) => {
            return (
              <Stack
                gap={'sm'}
                flexDirection={'column'}
                className={cardClass}
                key={signer.pubKey}
              >
                <RenderSigner
                  transaction={transaction}
                  signer={signer}
                  transactionStatus={transaction.status}
                  onSign={onSign}
                />
              </Stack>
            );
          })}
        </Stack>
        {externalSigners.length > 0 && (
          <Stack
            title="External Signers"
            key={'external-signatures'}
            flexDirection={'column'}
            gap={'sm'}
          >
            <Heading variant="h4">External Signers</Heading>
            {externalSigners.map((signer) => {
              return (
                <Stack
                  gap={'sm'}
                  flexDirection={'column'}
                  className={cardClass}
                  key={signer.pubKey}
                >
                  <RenderSigner
                    transaction={transaction}
                    signer={signer}
                    transactionStatus={transaction.status}
                    onSign={onSign}
                  />
                </Stack>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
