import { ICommandResult } from '@kadena/chainweb-node-client';
import { isSignedCommand, Pact, signWithChainweaver } from '@kadena/client';

import { pollStatus, submit } from './util/client';

export async function doSafeTransfer(
  from: { account: string; publicKey: string },
  to: { account: string; publicKey: string },
  amount: string,
): Promise<Record<string, ICommandResult>> {
  const unsignedTr = Pact.builder
    .execute(
      // the first transfer is here to make sure the receiver has also signed the command
      Pact.modules.coin.transfer(to.account, from.account, { decimal: '1' }),
      // the actual transfer
      Pact.modules.coin.transfer(from.account, to.account, { decimal: amount }),
    )
    .addSigner(from.publicKey, (withCapability) => [
      withCapability('coin.TRANSFER', from.account, to.account, {
        decimal: (Number(amount) + 1).toString(),
      }),
    ])
    .addSigner(to.publicKey, (withCapability) => [
      withCapability('coin.TRANSFER', to.account, from.account, {
        decimal: '1',
      }),
    ])
    .setNetworkId('mainnet01')
    .setMeta({ chainId: '1' })
    .setNonce('tadasd')
    .createTransaction();

  const [signedCommand] = await signWithChainweaver(unsignedTr);

  // probably in this step you need to send the transaction to another party to sign and then send to the blockchain
  // but for simplicity lets consider you want to transfer from your accounts that you sign in one qo via the wallet
  if (isSignedCommand(signedCommand)) {
    const receivedKeys = await submit(signedCommand);
    const status = await pollStatus(receivedKeys);
    return status;
  }
  throw new Error('UNSIGNED_COMMAND');
}
