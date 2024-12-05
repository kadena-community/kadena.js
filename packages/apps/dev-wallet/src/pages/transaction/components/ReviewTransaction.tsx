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
import { cardClass, codeClass } from './style.css.ts';

import { ITransaction } from '@/modules/transaction/transaction.repository.ts';
import { useWallet } from '@/modules/wallet/wallet.hook.tsx';
import { MonoContentCopy } from '@kadena/kode-icons/system';
import { isSignedCommand } from '@kadena/pactjs';
import { Signers } from './Signers.tsx';
import { Label, Value } from './helpers.tsx';

export function ReviewTransaction({
  transaction,
  transactionStatus,
  onSign,
}: {
  transaction: IUnsignedCommand;
  transactionStatus: ITransaction['status'];
  onSign: (sig: ITransaction['sigs']) => void;
}) {
  const { sign } = useWallet();
  const command: IPactCommand = useMemo(
    () => JSON.parse(transaction.cmd),
    [transaction.cmd],
  );

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
        <Stack flexDirection={'column'} gap={'xl'}>
          <Stack gap={'sm'} flexDirection={'column'}>
            <Heading variant="h4">hash (request-key)</Heading>
            <Value className={codeClass}>{transaction.hash}</Value>
          </Stack>
          {'exec' in command.payload && (
            <>
              <Stack gap={'sm'} flexDirection={'column'}>
                <Heading variant="h4">Code</Heading>
                <Value className={codeClass}>{command.payload.exec.code}</Value>
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
                  {new Date(command.meta.creationTime! * 1000).toLocaleString()}
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
          <Signers
            transaction={transaction}
            transactionStatus={transactionStatus}
            onSign={onSign}
          />
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
            {!isSignedCommand(transaction) && (
              <Button onClick={signAll} variant="outlined">
                Sign all possible signers
              </Button>
            )}
          </Stack>
          <Stack gap={'sm'}>
            <Button onClick={copyTransactionAs('yaml')}>Copy as YAML</Button>
            <Button onClick={copyTransactionAs('json')}>Copy as JSON</Button>
          </Stack>
        </Stack>
      </DialogFooter>
    </>
  );
}
