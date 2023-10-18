import type { ICommandResult } from '@kadena/chainweb-node-client';
import { isSignedTransaction, Pact, signWithChainweaver } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import { listen, submit } from './util/client';
import { keyFromAccount } from './util/keyFromAccount';

const NETWORK_ID: string = 'testnet04';

async function doSafeTransfer(
  from: { account: string; publicKey: string },
  to: { account: string; publicKey: string },
  amount: string,
): Promise<ICommandResult> {
  // we transfer this amount from receiver to sender to ensure that the receiver also signed the tr,
  // However we return this amount in the second code when we do tha actual transfer
  const aLowAmount = new PactNumber('0.001').toPactDecimal();

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
      withCapability('coin.GAS'),
      withCapability('coin.TRANSFER', from.account, to.account, pactDecimal),
    ])
    .addSigner(to.publicKey, (withCapability) => [
      withCapability('coin.TRANSFER', to.account, from.account, aLowAmount),
    ])
    .setNetworkId(NETWORK_ID)
    .setMeta({ chainId: '1', senderAccount: from.account })
    .createTransaction();

  const signedCommand = await signWithChainweaver(unsignedTr);

  // probably in this step you need to send the transaction to another party to sign the tr as well, and then send it to the blockchain
  // but for simplicity lets consider you want to transfer from your accounts that you sign in one go via the wallet
  if (isSignedTransaction(signedCommand)) {
    console.log(signedCommand);
    const receivedKey = await submit(signedCommand);
    const status = await listen(receivedKey);
    return status;
  }
  throw new Error('UNSIGNED_COMMAND');
}

const senderAccount: string =
  'k:dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46';
const receiverAccount: string =
  'k:2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e11';

doSafeTransfer(
  {
    account: senderAccount,
    publicKey: keyFromAccount(senderAccount),
  },
  {
    account: receiverAccount,
    publicKey: keyFromAccount(receiverAccount),
  },
  '10',
)
  .then((result) => {
    console.log('success', result);
  })
  .catch((error) => {
    console.error('error', error);
  });
