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

import { Confirmation } from '@/Components/Confirmation/Confirmation';
import { CopyButton } from '@/Components/CopyButton/CopyButton';
import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { copyTransactionAs } from '@/utils/copyTransactionAs';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate';
import { base64UrlEncodeArr } from '@kadena/cryptography-utils';
import {
  MonoClose,
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
  const { getPublicKeyData, sign } = useWallet();
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [showCommandDetails, setShowCommandDetails] = useState(false);
  const navigate = usePatchedNavigate();

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
          <CodeView codes={parsedCode} command={command} />
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
                </Stack>
              </>
            )}

            {!sendDisabled && (
              <Stack>
                <Stack justifyContent="space-between" flex={1}>
                  {statusPassed(transaction.status, 'success') ? (
                    <Button
                      variant="outlined"
                      startVisual={<MonoClose />}
                      onPress={() => {
                        navigate('/');
                      }}
                    >
                      Go Back
                    </Button>
                  ) : (
                    <Confirmation
                      label="Abort"
                      onPress={() => {
                        if (transaction.uuid) {
                          transactionRepository.deleteTransaction(
                            transaction?.uuid,
                          );
                        }

                        if (isDialog) {
                          return;
                        }
                        navigate('/');
                      }}
                      trigger={
                        <Button
                          isDisabled={statusPassed(
                            transaction.status,
                            'submitted',
                          )}
                          variant="outlined"
                          startVisual={<MonoClose />}
                        >
                          Abort
                        </Button>
                      }
                    >
                      Are you sure you want to abort this transaction?
                    </Confirmation>
                  )}
                  <Button
                    variant="outlined"
                    onPress={() => setShowCommandDetails((v) => !v)}
                  >
                    {showCommandDetails
                      ? 'Hide Command details'
                      : 'Show Command details'}
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
                {
                  label: 'Continuation Preflight Result',
                  data: contTx?.preflight,
                },
                {
                  label: 'Continuation Request',
                  data: contTx?.request,
                },
                {
                  label: 'Continuation Result',
                  data: contTx?.result,
                },
              ]}
            />
          </Stack>
        </Stack>
      </Content>
    </>
  );
}
