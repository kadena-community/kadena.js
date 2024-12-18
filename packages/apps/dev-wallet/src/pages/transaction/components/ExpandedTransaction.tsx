import { ICommand, IUnsignedCommand } from '@kadena/client';
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  DialogContent,
  DialogHeader,
  Heading,
  Notification,
  Stack,
  TabItem,
  Tabs,
  Tooltip,
} from '@kadena/kode-ui';
import yaml from 'js-yaml';

import { codeClass, txDetailsClass, txExpandedWrapper } from './style.css.ts';

import { CopyButton } from '@/Components/CopyButton/CopyButton.tsx';
import { ITransaction } from '@/modules/transaction/transaction.repository.ts';
import { useWallet } from '@/modules/wallet/wallet.hook.tsx';
import { panelClass } from '@/pages/home/style.css.ts';

import { shorten } from '@/utils/helpers.ts';
import { normalizeTx } from '@/utils/normalizeSigs.ts';
import { base64UrlEncodeArr } from '@kadena/cryptography-utils';
import {
  MonoContentCopy,
  MonoMoreVert,
  MonoShare,
} from '@kadena/kode-icons/system';
import classNames from 'classnames';
import { useState } from 'react';
import { CommandView } from './CommandView.tsx';
import { statusPassed, TxPipeLine } from './TxPipeLine.tsx';

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
  const { sign } = useWallet();
  const [showShareTooltip, setShowShareTooltip] = useState(false);

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
  return (
    <>
      <Title>
        <Stack justifyContent={'space-between'}>
          {showTitle && <Heading>View Transaction</Heading>}
        </Stack>
      </Title>
      <Content>
        <Stack gap={'lg'} width="100%" className={txExpandedWrapper}>
          <Stack
            gap={'lg'}
            flexDirection={'column'}
            style={{
              minWidth: '260px',
            }}
            className={panelClass}
          >
            <Stack justifyContent={'space-between'} alignItems={'center'}>
              <Heading variant="h6">Tx Status</Heading>
            </Stack>
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
          <Stack
            flex={1}
            gap={'xxl'}
            flexDirection={'column'}
            className={classNames(panelClass, txDetailsClass)}
          >
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
            <Tabs isContained>
              <TabItem title="Command Details">
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
              </TabItem>

              {transaction.preflight &&
                ((
                  <TabItem title="Preflight Result">
                    <JsonView
                      title="Preflight Result"
                      data={transaction.preflight}
                    />
                  </TabItem>
                ) as any)}

              {transaction.request && (
                <TabItem title="Request">
                  <JsonView title="Request" data={transaction.request} />
                </TabItem>
              )}
              {'result' in transaction && transaction.result && (
                <TabItem title="Result">
                  <JsonView title="Result" data={transaction.result} />
                </TabItem>
              )}
              {transaction.continuation?.proof && (
                <TabItem title="SPV Proof">
                  <JsonView
                    title="Result"
                    data={transaction.continuation?.proof}
                    shortening={40}
                  />
                </TabItem>
              )}
              {contTx && [
                <TabItem title="cont: Command Details">
                  <Stack gap={'sm'} flexDirection={'column'}>
                    <Heading variant="h4">Command Details</Heading>
                    <CommandView transaction={contTx} onSign={onSign} />
                  </Stack>
                </TabItem>,
                contTx.preflight && (
                  <TabItem title="cont: Preflight Result">
                    <JsonView
                      title="Continuation Preflight Result"
                      data={contTx.preflight}
                    />
                  </TabItem>
                ),
                contTx.request && (
                  <TabItem title="cont: Request">
                    <JsonView
                      title="Continuation Request"
                      data={contTx.request}
                    />
                  </TabItem>
                ),
                'result' in contTx && contTx.result && (
                  <TabItem title="cont: Result">
                    <JsonView
                      title="Continuation Result"
                      data={contTx.result}
                    />
                  </TabItem>
                ),
              ]}
            </Tabs>
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
