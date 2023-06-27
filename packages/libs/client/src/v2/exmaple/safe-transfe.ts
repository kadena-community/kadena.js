import { getClient } from '../client/client';
import { commandBuilder, ICommand, meta, payload, set, signer } from '../pact';
import { sign } from '../sing';

import { coin } from './coin-contract';

async function doSafeTransfer(from: string, to: string, amount: string) {
  const { submit } = getClient();

  const command = commandBuilder(
    payload.exec([coin.transfer(from, to, { decimal: amount })]),
    signer(from, (withCapability) => [
      withCapability('coin.TRANSFER', from, to, { decimal: amount }),
    ]),
    signer(to, (withCapability) => [
      withCapability('coin.TRANSFER', to, from, { decimal: amount }),
    ]),
    set('networkId', 'mainnet01'),
    meta({ chainId: '1' }),
  ).command as ICommand;

  const signedCommand = await sign(command);
  const [, poll] = await submit(signedCommand);
  const status = await poll();
  return status;
}
