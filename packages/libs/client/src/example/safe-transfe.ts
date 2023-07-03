/* istanbul ignore file */
// this module is just a code snippet for the safe transfer

import { ICommandResult } from '@kadena/chainweb-node-client';

import { getClient } from '../client/client';
import {
  commandBuilder,
  ICommand,
  payload,
  setMeta,
  setProp,
  setSigner,
} from '../index';
import { Pact } from '../pact';
import { quicksign } from '../sign';

const { coin } = Pact.modules;

export async function doSafeTransfer(
  from: string,
  to: string,
  amount: string,
): Promise<Record<string, ICommandResult>> {
  const { submit, pollStatus } = getClient();

  const command = commandBuilder(
    payload.exec([
      // the first two transfers are to make sure the receiver has also signed the command
      coin.transfer(from, to, { decimal: '0.01' }),
      coin.transfer(to, from, { decimal: '0.01' }),
      // the actual transfer
      coin.transfer(from, to, { decimal: amount }),
    ]),
    setSigner(from, (withCapability) => [
      withCapability('coin.TRANSFER', from, to, { decimal: amount }),
      withCapability('coin.TRANSFER', from, to, { decimal: '0.01' }),
    ]),
    setSigner(to, (withCapability) => [
      withCapability('coin.TRANSFER', to, from, { decimal: '0.01' }),
    ]),
    setProp('networkId', 'mainnet01'),
    setMeta({ chainId: '1' }),
  ) as ICommand;

  const signedCommand = await quicksign(command);
  const receivedKeys = await submit(signedCommand);
  const status = await pollStatus(receivedKeys);

  return status;
}
