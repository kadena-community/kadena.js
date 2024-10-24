import { ICommand, IUnsignedCommand } from '@kadena/client';
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Heading,
  Notification,
  Stack,
  TabItem,
  Tabs,
} from '@kadena/kode-ui';
import yaml from 'js-yaml';

import { codeClass } from './style.css.ts';

import { CopyButton } from '@/Components/CopyButton/CopyButton.tsx';
import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository.ts';
import { useWallet } from '@/modules/wallet/wallet.hook.tsx';
import { panelClass } from '@/pages/home/style.css.ts';
import { useAsync } from '@/utils/useAsync.tsx';
import { MonoMoreVert } from '@kadena/kode-icons/system';
import { CommandView } from './CommandView.tsx';
import { statusPassed, TxPipeLine } from './TxPipeLine.tsx';

export function ExpandedTransaction({
  transaction,
  onSign,
  sendDisabled,
  onSubmit,
}: {
  transaction: ITransaction;
  onSign: (sig: ITransaction['sigs']) => void;
  onSubmit: () => Promise<ITransaction>;
  sendDisabled?: boolean;
}) {
  const { sign } = useWallet();

  const [contTx] = useAsync(
    (tx) =>
      tx.continuation?.continuationTxId
        ? transactionRepository.getTransaction(
            tx.continuation?.continuationTxId,
          )
        : Promise.resolve(null),
    [transaction],
  );

  console.log('contTx', contTx);

  const copyTransactionAs = (format: 'json' | 'yaml') => () => {
    const transactionData = {
      hash: transaction.hash,
      cmd: transaction.cmd,
      sigs: transaction.sigs,
    };

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
  return (
    <>
      <DialogHeader>
        <Stack justifyContent={'space-between'}>
          <Heading>View Transaction</Heading>
        </Stack>
      </DialogHeader>
      <DialogContent>
        <Stack gap={'lg'}>
          <Stack
            gap={'lg'}
            flexDirection={'column'}
            style={{
              flexBasis: '260px',
              minWidth: '260px',
            }}
            className={panelClass}
          >
            <Heading variant="h6">Tx Status</Heading>
            <TxPipeLine
              tx={transaction}
              variant={'expanded'}
              signAll={signAll}
              onSubmit={onSubmit}
              sendDisabled={sendDisabled}
            />
          </Stack>
          <Stack
            flex={1}
            gap={'xxl'}
            flexDirection={'column'}
            className={panelClass}
          >
            <Tabs isContained>
              <TabItem title="Command Details">
                <Stack gap={'sm'} flexDirection={'column'}>
                  <Stack justifyContent={'space-between'}>
                    <Heading variant="h4">Command Details</Heading>
                    <Stack gap={'sm'}>
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
                          label="Copy as JSON"
                          onClick={copyTransactionAs('json')}
                        />
                        <ContextMenuItem
                          label="Copy as YAML"
                          onClick={copyTransactionAs('yaml')}
                        />
                        <ContextMenuItem
                          label="Copy as CMS"
                          onClick={copyTransactionAs('json')}
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
      </DialogContent>
      <DialogFooter>
        <Stack
          gap={'sm'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          flex={1}
        >
          <Stack>
            {statusPassed(transaction.status, 'success') &&
              (!transaction.continuation?.autoContinue ||
                (contTx && statusPassed(contTx.status, 'success'))) && (
                <Notification intent="positive" role="status">
                  Transaction is successful
                </Notification>
              )}
          </Stack>
        </Stack>
      </DialogFooter>
    </>
  );
}

const JsonView = ({ title, data }: { title: string; data: any }) => (
  <Stack gap={'sm'} flexDirection={'column'}>
    <Stack gap={'sm'} flexDirection={'column'}>
      <Stack justifyContent={'space-between'}>
        <Heading variant="h4">{title}</Heading>
        <CopyButton data={data} />
      </Stack>
      <pre className={codeClass}>
        {data && typeof data === 'object'
          ? JSON.stringify(data, null, 2)
          : data}
      </pre>
    </Stack>
  </Stack>
);
