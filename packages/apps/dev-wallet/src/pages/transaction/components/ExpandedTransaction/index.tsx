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
  Notification,
  Stack,
  TabItem,
  Tabs,
  Tooltip,
} from '@kadena/kode-ui';
import yaml from 'js-yaml';

import {
  codeClass,
  txDetailsClass,
  txExpandedWrapper,
} from './../style.css.ts';

import { CopyButton } from '@/Components/CopyButton/CopyButton';
import { ITransaction } from '@/modules/transaction/transaction.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { panelClass } from '@/pages/home/style.css';

import { ErrorBoundary } from '@/Components/ErrorBoundary/ErrorBoundary.tsx';
import { shorten } from '@/utils/helpers.ts';
import { normalizeTx } from '@/utils/normalizeSigs';
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
import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { CodeView } from '../code-components/CodeView.tsx';
import { RenderSigner } from '../Signer.tsx';
import { CommandView } from './../CommandView';
import { statusPassed, TxPipeLine } from './../TxPipeLine';

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

  const copyTransactionAs =
    (format: 'json' | 'yaml', legacySig = false) =>
    () => {
      const tx = {
        hash: transaction.hash,
        cmd: transaction.cmd,
        sigs: transaction.sigs,
      };
      const transactionData = legacySig ? normalizeTx(tx) : tx;

      let formattedData: string;
      if (format === 'json') {
        formattedData = JSON.stringify(transactionData, null, 2);
      } else {
        formattedData = yaml.dump(transactionData);
      }

      navigator.clipboard.writeText(formattedData);
    };

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
        <Stack gap={'lg'} width="100%" className={txExpandedWrapper}>
          <Card fullWidth>
            <CardContentBlock title="Transaction">
              <ErrorBoundary>
                <CodeView codes={parsedCode} command={command} />
              </ErrorBoundary>
            </CardContentBlock>
          </Card>
          <Card fullWidth>
            <CardContentBlock
              title="In the queue"
              visual={<MonoTroubleshoot />}
            >
              <TxPipeLine
                tx={transaction}
                contTx={contTx}
                variant={'expanded'}
                signAll={signAll}
                onSubmit={onSubmit}
                onPreflight={onPreflight}
                sendDisabled={sendDisabled}
              />
            </CardContentBlock>
          </Card>

          <Stack flex={1} gap={'xxl'} flexDirection={'column'}>
            {statusPassed(transaction.status, 'success') &&
              (!transaction.continuation?.autoContinue ||
                (contTx && statusPassed(contTx.status, 'success'))) && (
                <Stack>
                  <Notification intent="positive" role="status">
                    Transaction is successful
                  </Notification>
                </Stack>
              )}
            {transaction.status === 'failure' &&
              (!transaction.continuation?.autoContinue ||
                (contTx && contTx.status === 'failure')) && (
                <Stack>
                  <Notification intent="negative" role="status">
                    Transaction is failed
                  </Notification>
                </Stack>
              )}

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
                          onClick={copyTransactionAs('json')}
                        />
                        <ContextMenuItem
                          label="YAML"
                          endVisual={<MonoContentCopy />}
                          onClick={copyTransactionAs('yaml')}
                        />
                        <ContextMenuItem
                          label="JSON Legacy (v2)"
                          endVisual={<MonoContentCopy />}
                          onClick={copyTransactionAs('json', true)}
                        />
                        <ContextMenuItem
                          label="YAML Legacy (v2)"
                          endVisual={<MonoContentCopy />}
                          onClick={copyTransactionAs('yaml', true)}
                        />
                      </ContextMenu>
                    </Stack>
                  </Stack>
                  <CommandView transaction={transaction} onSign={onSign} />
                </Stack>
              </>
            )}

            <Stack>
              <Button variant="outlined" onPress={() => {}}>
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
                  isDisabled={!statusPassed(transaction.status, 'signed')}
                  type="submit"
                >
                  Send Transaction
                </Button>
              </Stack>
            </Stack>

            {transaction.preflight &&
              ((
                <JsonView
                  title="Preflight Result"
                  data={transaction.preflight}
                />
              ) as any)}

            {transaction.request && (
              <JsonView title="Request" data={transaction.request} />
            )}
            {'result' in transaction && transaction.result && (
              <JsonView title="Result" data={transaction.result} />
            )}
            {transaction.continuation?.proof && (
              <JsonView
                title="Result"
                data={transaction.continuation?.proof}
                shortening={40}
              />
            )}
            {contTx && [
              <Stack gap={'sm'} flexDirection={'column'}>
                <Heading variant="h4">Command Details</Heading>
                <CommandView transaction={contTx} onSign={onSign} />
              </Stack>,
              contTx.preflight && (
                <JsonView
                  title="Continuation Preflight Result"
                  data={contTx.preflight}
                />
              ),
              contTx.request && (
                <JsonView title="Continuation Request" data={contTx.request} />
              ),
              'result' in contTx && contTx.result && (
                <JsonView title="Continuation Result" data={contTx.result} />
              ),
            ]}
          </Stack>
        </Stack>
      </Content>
    </>
  );
}

const JsonView = ({
  title,
  data,
  shortening = 0,
}: {
  title: string;
  data: any;
  shortening?: number;
}) => (
  <Stack gap={'sm'} flexDirection={'column'}>
    <Stack gap={'sm'} flexDirection={'column'}>
      <Stack justifyContent={'space-between'}>
        <Heading variant="h4">{title}</Heading>
        <CopyButton data={data} />
      </Stack>
      <pre className={codeClass}>
        {data && typeof data === 'object'
          ? JSON.stringify(data, null, 2)
          : shortening
            ? shorten(data, shortening)
            : data}
      </pre>
    </Stack>
  </Stack>
);
