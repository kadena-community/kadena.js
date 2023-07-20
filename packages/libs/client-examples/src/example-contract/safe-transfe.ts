import { ICommandResult } from '@kadena/chainweb-node-client';
import { isSignedCommand, Pact, signWithChainweaver } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';

import { pollStatus, submit } from './util/client';

export async function doSafeTransfer(
  from: { account: string; publicKey: string },
  to: { account: string; publicKey: string },
  amount: string,
): Promise<Record<string, ICommandResult>> {
  // we transfer this amount from receiver to sender to ensure that the receiver also signed the tr,
  // However we return this amount in the second code when we do tha actual transfer
  const aLowAmount = new PactNumber('0.0000000000001').toPactDecimal();

  // we add the aLowAmount to the transferAmount as we only added it to verify the receiver also signed the command
  const pactDecimal = new PactNumber(amount)
    .plus(aLowAmount.decimal)
    .toPactDecimal();

  const unsignedTr = Pact.builder
    .execution(
      // the first transfer is here to make sure the receiver has also signed the command
      Pact.modules.coin.transfer(to.account, from.account, aLowAmount),
      // the actual transfer
      Pact.modules.coin.transfer(from.account, to.account, pactDecimal),
    )
    .addSigner(from.publicKey, (withCapability) => [
      withCapability('coin.TRANSFER', from.account, to.account, pactDecimal),
    ])
    .addSigner(to.publicKey, (withCapability) => [
      withCapability('coin.TRANSFER', to.account, from.account, aLowAmount),
    ])
    .setNetworkId('mainnet01')
    .setMeta({ chainId: '1' })
    .setNonce('tadasd')
    .createTransaction();

  const signedCommand = await signWithChainweaver(unsignedTr);

  // probably in this step you need to send the transaction to another party to sign the tr as well, and then send it to the blockchain
  // but for simplicity lets consider you want to transfer from your accounts that you sign in one go via the wallet
  if (isSignedCommand(signedCommand)) {
    const receivedKey = await submit(signedCommand);
    const status = await pollStatus(receivedKey);
    return status;
  }
  throw new Error('UNSIGNED_COMMAND');
}
