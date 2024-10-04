import { ICommand, IPactCommand, IUnsignedCommand } from '@kadena/client';
import {
  Button,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Heading,
  Stack,
} from '@kadena/kode-ui';
import yaml from 'js-yaml';
import { useMemo } from 'react';
import { cardClass, codeClass, successClass } from './style.css.ts';

import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository.ts';
import { useWallet } from '@/modules/wallet/wallet.hook.tsx';
import { useAsync } from '@/utils/useAsync.tsx';
import { MonoCheck, MonoContentCopy } from '@kadena/kode-icons/system';
import { Signers } from './Signers.tsx';
import { statusPassed } from './TxTile.tsx';
import { Label, Value } from './helpers.tsx';

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
  const command: IPactCommand = useMemo(
    () => JSON.parse(transaction.cmd),
    [transaction.cmd],
  );

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
  return (
    <>
      <DialogHeader>
        <Stack justifyContent={'space-between'}>
          <Heading>View Transaction</Heading>
          <Button variant="transparent" onClick={copyTransactionAs('json')}>
            <MonoContentCopy />
          </Button>
        </Stack>
      </DialogHeader>
      <DialogContent>
        {!statusPassed(transaction.status, 'preflight') && (
          <Stack flexDirection={'column'} gap={'xl'}>
            <Stack gap={'sm'} flexDirection={'column'}>
              {statusPassed(transaction.status, 'signed') && (
                <Heading variant="h4" className={successClass}>
                  <Stack alignItems={'center'}>
                    <MonoCheck />
                    All Signed
                  </Stack>
                </Heading>
              )}
              <Heading variant="h4">hash (request-key)</Heading>
              <Value className={codeClass}>{transaction.hash}</Value>
            </Stack>
            {'exec' in command.payload && (
              <>
                <Stack gap={'sm'} flexDirection={'column'}>
                  <Heading variant="h4">Code</Heading>
                  <Value className={codeClass}>
                    {command.payload.exec.code}
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
                    {new Date(
                      command.meta.creationTime! * 1000,
                    ).toLocaleString()}
                    )
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
            <Signers transaction={transaction} onSign={onSign} />
          </Stack>
        )}
        {statusPassed(transaction.status, 'preflight') && (
          <Stack gap={'sm'} flexDirection={'column'}>
            <Heading variant="h4" className={successClass}>
              <Stack alignItems={'center'}>
                <MonoCheck />
                Preflight Passed
              </Stack>
            </Heading>
            <Stack gap={'sm'} flexDirection={'column'}>
              <Heading variant="h4">Result</Heading>
              <pre className={codeClass}>
                {JSON.stringify(transaction.preflight, null, 2)}
              </pre>
            </Stack>
          </Stack>
        )}
        {statusPassed(transaction.status, 'submitted') && (
          <Stack gap={'sm'} flexDirection={'column'}>
            <Heading variant="h4" className={successClass}>
              <Stack alignItems={'center'}>
                <MonoCheck />
                Transaction Mined
              </Stack>
            </Heading>
            <Stack gap={'sm'} flexDirection={'column'}>
              <Heading variant="h4">Request</Heading>
              <pre className={codeClass}>
                {JSON.stringify(transaction.request, null, 2)}
              </pre>
            </Stack>
          </Stack>
        )}
        {statusPassed(transaction.status, 'success') && (
          <Stack gap={'sm'} flexDirection={'column'}>
            <Heading variant="h4" className={successClass}>
              <Stack alignItems={'center'}>
                <MonoCheck />
                Transaction Mined
              </Stack>
            </Heading>
            <Stack gap={'sm'} flexDirection={'column'}>
              <Heading variant="h4">Result</Heading>
              <pre className={codeClass}>
                {JSON.stringify(
                  'result' in transaction ? transaction.result : {},
                  null,
                  2,
                )}
              </pre>
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <DialogFooter>
        <Stack
          gap={'sm'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          flex={1}
        >
          {!statusPassed(transaction.status, 'signed') && (
            <Stack>
              <Button onClick={signAll} variant="outlined">
                Sign all possible signers
              </Button>
            </Stack>
          )}
          {transaction.status === 'signed' && !sendDisabled && (
            <Stack>
              <Button variant="outlined" onClick={onSubmit}>
                Send transactions
              </Button>
            </Stack>
          )}
          <Stack gap={'sm'}>
            <Button onClick={copyTransactionAs('yaml')}>Copy as YAML</Button>
            <Button onClick={copyTransactionAs('json')}>Copy as JSON</Button>
          </Stack>
        </Stack>
      </DialogFooter>
    </>
  );
}
