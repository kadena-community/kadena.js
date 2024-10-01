/**
 * This script requests coins from the faucet for the gas payer and the sender, then transfers coins from the sender to the receiver.
 * this used read and transaction functions which are defined in the client configuration file.
 */
import { transferCreateCommand } from '@kadena/client-utils/coin';
import {
  fundExistingAccountOnTestnetCommand,
  fundNewAccountOnTestnetCommand,
} from '@kadena/client-utils/faucet';
import { composePactCommand } from '@kadena/client/fp';
import { PactNumber } from '@kadena/pactjs';
import { defaultGasPayer, read, transaction } from './config/client';
import { GAS_PAYER, RECEIVER, SENDER } from './config/wallet-helpers';

async function requestCoin(publicKey: string) {
  const myAccount = await read(`(coin.details "k:${publicKey}")`)
    .execute()
    .catch(() => null);

  const command = myAccount
    ? fundExistingAccountOnTestnetCommand({
        account: `k:${publicKey}`,
        amount: 10,
        signerKeys: [GAS_PAYER.publicKey],
      })
    : fundNewAccountOnTestnetCommand({
        account: `k:${publicKey}`,
        keyset: { keys: [publicKey], pred: 'keys-all' },
        amount: 10,
        signerKeys: [GAS_PAYER.publicKey],
      });

  return transaction(command)
    .on('sign', (tx) => console.log('signed', tx.hash))
    .on('submit', (tx) => console.log('submited', tx.requestKey))
    .on('listen', (data) => console.log('result', data.reqKey))
    .execute();
}

function transferCoin(senderKey: string, receiverKey: string, amount: number) {
  // I wanted to use the default gas payer for the transaction; otherwise you don't need the composePactCommand function here
  const command = composePactCommand(
    transferCreateCommand({
      sender: { account: `k:${senderKey}`, publicKeys: [senderKey] },
      receiver: {
        account: `k:${receiverKey}`,
        keyset: { keys: [receiverKey], pred: 'keys-all' },
      },
      amount: new PactNumber(amount).toDecimal(),
      // don't use sender as gas payer
      gasPayer: null,
    }),
    // add default gas payer to the command
    defaultGasPayer,
  );

  return transaction(command)
    .on('sign', (tx) => console.log('signed', tx.hash))
    .on('submit', (tx) => console.log('submited', tx.requestKey))
    .on('listen', (data) => console.log('result', data.reqKey))
    .execute();
}

async function main() {
  const senderKey = SENDER.publicKey;
  const receiverKey = RECEIVER.publicKey;
  const amount = 5;
  const [senderResult, receiverResult] = await Promise.all([
    requestCoin(GAS_PAYER.publicKey),
    requestCoin(senderKey),
  ]);
  console.log({ senderResult, receiverResult });
  const transferResult = await transferCoin(senderKey, receiverKey, amount);
  console.log({ transferResult });
}

main().catch(console.error);
