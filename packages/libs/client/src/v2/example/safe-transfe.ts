/* istanbul ignore file */
// this module is just a code snippet for the safe transfer

import { getClient } from '../client/client';
import { commandBuilder, ICommand, meta, payload, set, signer } from '../pact';
import { sign } from '../sign';
import { coin } from '../test/coin-contract';

async function doSafeTransfer(from: string, to: string, amount: string) {
  const { submit } = getClient();

  const command = commandBuilder(
    payload.exec([
      // the first two transfers are to make sure the receiver has also signed the command
      coin.transfer(from, to, { decimal: '0.01' }),
      coin.transfer(to, from, { decimal: '0.01' }),
      // the actual transfer
      coin.transfer(from, to, { decimal: amount }),
    ]),
    signer(from, (withCapability) => [
      withCapability('coin.TRANSFER', from, to, { decimal: amount }),
      withCapability('coin.TRANSFER', from, to, { decimal: '0.01' }),
    ]),
    signer(to, (withCapability) => [
      withCapability('coin.TRANSFER', to, from, { decimal: '0.01' }),
    ]),
    set('networkId', 'mainnet01'),
    meta({ chainId: '1' }),
  ).command as ICommand;

  const signedCommand = await sign(command);
  const [, poll] = await submit(signedCommand);
  const status = await poll();
  return status;
}
