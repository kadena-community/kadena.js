/* istanbul ignore file */
// this module is just a code snippet for the safe transfer

import { ICommandResult } from '@kadena/chainweb-node-client';

import { getClient } from '../client/client';
import { addSigner, commandBuilder, payload, setMeta, setProp } from '../index';
import { Pact } from '../pact';
import { quicksign } from '../sign';
import { createTransaction } from '../utils/createTransaction';

const { coin } = Pact.modules;

const getHostUrl = (networkId: string, chainId: string): string =>
  `http://localhost:8080/chainweb/0.0/${networkId}/chain/${chainId}/pact`;

const { submit, pollStatus } = getClient(getHostUrl);

export async function doSafeTransfer(
  from: { account: string; publicKey: string },
  to: { account: string; publicKey: string },
  amount: string,
): Promise<Record<string, ICommandResult>> {
  const command = commandBuilder(
    payload.exec(
      coin.transfer('asd', 'asdasd', { decimal: '1' }),
      // the first two transfers are to make sure the receiver has also signed the command
      coin.transfer(from.account, to.account, { decimal: '1' }),
      coin.transfer(to.account, from.account, { decimal: '1' }),
      // the actual transfer
      coin.transfer(from.account, to.account, { decimal: amount }),
    ),
    addSigner(from.publicKey, (withCapability) => [
      withCapability('coin.TRANSFER', from.account, to.account, {
        decimal: (Number(amount) + 1).toString(),
      }),
    ]),
    addSigner(to.publicKey, (withCapability) => [
      withCapability('coin.TRANSFER', to.account, from.account, {
        decimal: '1',
      }),
    ]),
    setProp('networkId', 'mainnet01'),
    setMeta({ chainId: '1' }),
    {
      nonce: 'tadasd',
    },
  );

  const signedCommand = await quicksign(createTransaction(command));

  const receivedKeys = await submit(signedCommand);
  const status = await pollStatus(receivedKeys);

  return status;
}
