import { ICommand, IPactCommand, IUnsignedCommand } from '@kadena/client';
import {
  Button,
  Card,
  ContextMenu,
  ContextMenuItem,
  DialogContent,
  DialogHeader,
  Divider,
  Heading,
  Stack,
  Tooltip,
} from '@kadena/kode-ui';

import { CopyButton } from '@/Components/CopyButton/CopyButton';
import { ErrorBoundary } from '@/Components/ErrorBoundary/ErrorBoundary.tsx';
import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { copyTransactionAs } from '@/utils/copyTransactionAs';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate';
import { base64UrlEncodeArr } from '@kadena/cryptography-utils';
import {
  MonoContentCopy,
  MonoMoreVert,
  MonoShare,
  MonoTroubleshoot,
} from '@kadena/kode-icons/system';
import { CardContentBlock } from '@kadena/kode-ui/patterns';
import { token } from '@kadena/kode-ui/styles';
import { execCodeParser } from '@kadena/pactjs-generator';
import { useEffect, useMemo, useState } from 'react';
import { CodeView } from '../code-components/CodeView';
import { RenderSigner } from '../Signer';
import { statusPassed } from '../TxPipeLine/utils';
import { CommandView } from './../CommandView';
import { TxPipeLine } from './../TxPipeLine';
import { CmdView } from './components/CmdView/CmdView';
import { JsonView } from './JsonView';

export function ExpandedTransaction({
  transaction,
  contTx,
  onSign,
  sendDisabled,
  onSubmit,
  showTitle,
  isDialog,
  onPreflight,
}: {
  transaction: ITransaction;
  contTx?: ITransaction;
  onSign: (sig: ITransaction['sigs']) => void;
  onSubmit: (skipPreflight?: boolean) => Promise<ITransaction>;
  onPreflight: () => Promise<ITransaction>;
  sendDisabled?: boolean;
  showTitle?: boolean;
  isDialog?: boolean;
}) {
  const navigate = usePatchedNavigate();
  const { getPublicKeyData, sign } = useWallet();
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [showCommandDetails, setShowCommandDetails] = useState(false);

  const signAll = async () => {
    const signedTx = (await sign(transaction)) as IUnsignedCommand | ICommand;
    onSign(signedTx.sigs);
  };
  const txCommand = {
    hash: transaction.hash,
    cmd: transaction.cmd,
    sigs: transaction.sigs,
  };

  const Title = isDialog ? DialogHeader : Stack;
  const Content = isDialog ? DialogContent : Stack;
  const [selectedTab, setSelectedTab] = useState('command-details');
  const activeTabs = [
    'command-details',
    transaction.preflight && 'preflight',
    transaction.request && 'request',
    'result' in transaction && transaction.result && 'result',
    transaction.continuation?.proof && 'spv',
    contTx && 'cont-command-details',
    contTx?.preflight && 'cont-preflight',
    contTx?.request && 'cont-request',
    contTx && 'result' in contTx && contTx.result && 'cont-result',
  ].filter(Boolean) as string[];

  useEffect(() => {
    const lastTab = activeTabs[activeTabs.length - 1];
    if (lastTab !== selectedTab) {
      setSelectedTab(lastTab);
    }
  }, [activeTabs.length]);

  const command: IPactCommand = useMemo(
    () => JSON.parse(transaction.cmd),
    [transaction.cmd],
  );

  const parsedCode = useMemo(() => {
    if ('exec' in command.payload) {
      return execCodeParser(command.payload.exec.code);
    }
    return [];
  }, [command.payload]);

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

  return (
    <>
      <Title>
        <Stack justifyContent={'space-between'}>
          {showTitle && <Heading>View Transaction</Heading>}
        </Stack>
      </Title>
      <Content>
        <Stack
          gap="md"
          flexDirection={'column'}
          width="100%"
          marginBlockEnd={'md'}
        >
          {parsedCode && (
            <Card fullWidth>
              <CardContentBlock title="Transaction">
                <ErrorBoundary>
                  <CodeView codes={parsedCode} command={command} />
                </ErrorBoundary>
              </CardContentBlock>
            </Card>
          )}
          <Card fullWidth>
            <CardContentBlock
              level={2}
              title="In the queue"
              visual={<MonoTroubleshoot width={24} height={24} />}
            >
              <Stack style={{ marginBlockStart: '-80px' }}>
                <TxPipeLine
                  tx={transaction}
                  contTx={contTx}
                  variant={'expanded'}
                  signAll={signAll}
                  onSubmit={onSubmit}
                  onPreflight={onPreflight}
                  sendDisabled={sendDisabled}
                />
              </Stack>
            </CardContentBlock>
          </Card>

          <Stack flex={1} gap={'xxl'} flexDirection={'column'}>
            {signers.map((signer) => (
              <RenderSigner
                key={signer.pubKey}
                transaction={transaction}
                signer={signer}
                transactionStatus={transaction.status}
                onSign={onSign}
              />
            ))}

            {showCommandDetails && (
              <>
                <Divider
                  label="Command details"
                  bgColor={token('color.neutral.n1')}
                />

                <Stack gap={'sm'} flexDirection={'column'}>
                  <Stack justifyContent={'space-between'}>
                    <Heading variant="h4">Command Details</Heading>
                    <Stack gap={'sm'}>
                      <Tooltip
                        content="The transaction url is copied to to the clipboard."
                        position="left"
                        isOpen={showShareTooltip}
                      >
                        <Button
                          startVisual={<MonoShare />}
                          variant="transparent"
                          onClick={() => {
                            const encodedTx = base64UrlEncodeArr(
                              new TextEncoder().encode(
                                JSON.stringify({
                                  hash: txCommand.hash,
                                  cmd: txCommand.cmd,
                                  sigs: txCommand.sigs,
                                }),
                              ),
                            );
                            const baseUrl = `${window.location.protocol}//${window.location.host}`;
                            navigator.clipboard.writeText(
                              `${baseUrl}/sig-builder#${encodedTx}`,
                            );
                            setShowShareTooltip(true);
                            setTimeout(() => setShowShareTooltip(false), 5000);
                          }}
                          isCompact
                        />
                      </Tooltip>
                      <CopyButton data={txCommand} />
                      <ContextMenu
                        placement="bottom end"
                        trigger={
                          <Button
                            endVisual={<MonoMoreVert />}
                            variant="transparent"
                            isCompact
                          />
                        }
                      >
                        <ContextMenuItem
                          label="JSON"
                          endVisual={<MonoContentCopy />}
                          onClick={copyTransactionAs('json', transaction)}
                        />
                        <ContextMenuItem
                          label="YAML"
                          endVisual={<MonoContentCopy />}
                          onClick={copyTransactionAs('yaml', transaction)}
                        />
                        <ContextMenuItem
                          label="JSON Legacy (v2)"
                          endVisual={<MonoContentCopy />}
                          onClick={copyTransactionAs('json', transaction, true)}
                        />
                        <ContextMenuItem
                          label="YAML Legacy (v2)"
                          endVisual={<MonoContentCopy />}
                          onClick={copyTransactionAs('yaml', transaction, true)}
                        />
                      </ContextMenu>
                    </Stack>
                  </Stack>
                  <CommandView transaction={transaction} />

                  {contTx && [
                    <Stack gap={'sm'} flexDirection={'column'}>
                      <Heading variant="h4">Command Details</Heading>
                      <CommandView transaction={contTx} />
                    </Stack>,
                    contTx.preflight && (
                      <JsonView
                        title="Continuation Preflight Result"
                        data={contTx.preflight}
                      />
                    ),
                    contTx.request && (
                      <JsonView
                        title="Continuation Request"
                        data={contTx.request}
                      />
                    ),
                    'result' in contTx && contTx.result && (
                      <JsonView
                        title="Continuation Result"
                        data={contTx.result}
                      />
                    ),
                  ]}
                </Stack>
              </>
            )}

            {!sendDisabled && (
              <Stack>
                <Button
                  variant="outlined"
                  isDisabled={statusPassed(transaction.status, 'submitted')}
                  onPress={() => {
                    if (transaction?.uuid) {
                      transactionRepository.deleteTransaction(
                        transaction?.uuid,
                      );
                    }

                    navigate('/');
                  }}
                >
                  Abort
                </Button>
                <Stack justifyContent="flex-end" flex={1} gap="sm">
                  <Button
                    variant="outlined"
                    onPress={() => setShowCommandDetails((v) => !v)}
                  >
                    {showCommandDetails
                      ? 'Hide Command details'
                      : 'Show Command details'}
                  </Button>
                  <Button
                    isDisabled={
                      !statusPassed(transaction.status, 'preflight') ||
                      statusPassed(transaction.status, 'submitted')
                    }
                    onPress={() => onSubmit(true)}
                  >
                    Send Transaction
                  </Button>
                </Stack>
              </Stack>
            )}

            <CmdView
              views={[
                {
                  label: 'Preflight',
                  data: transaction.preflight,
                },
                {
                  label: 'Request',
                  data: transaction.request,
                },
                {
                  label: 'Result',
                  data: transaction.result,
                },
                {
                  label: 'Continuation Proof',
                  data: transaction.continuation?.proof,
                },
              ]}
            />
          </Stack>
        </Stack>
      </Content>
    </>
  );
}
