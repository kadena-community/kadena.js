import { PactCommand } from '@kadena/client';
import { sign } from '@kadena/cryptography-utils';
import { createExp, ensureSignedCommand } from '@kadena/pactjs';

const NETWORK_ID = 'testnet04';
const chainId = '1';
const gasLimit = 2300;
const gasPrice = 0.00001;
const ttl = 28800;
export const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${chainId}/pact`;

export async function makeTransferCreate(
  fromAccount: string,
  toAccount: string,
  amount: string,
  fromPublicKey: string,
  toPublicKey: string,
  fromPrivateKey: string,
): Promise<void> {
  const pactCommand = new PactCommand();
  pactCommand.code = `(coin.transfer-create "${fromAccount}" "${toAccount}" (read-keyset "ks") ${amount})`;

  const numberAmount = Number(amount);

  pactCommand
    .addCap('coin.GAS', fromPublicKey)
    .addCap('coin.TRANSFER', fromPublicKey, [
      fromAccount,
      toAccount,
      numberAmount,
    ])
    .addData({ ks: { pred: 'keys-all', keys: [toPublicKey] } })
    .setMeta(
      {
        gasLimit: gasLimit,
        gasPrice: gasPrice,
        ttl: ttl,
        chainId: chainId,
        sender: fromAccount,
      },
      NETWORK_ID,
    );

  pactCommand.createCommand();

  const signature = sign(pactCommand.cmd ?? '', {
    secretKey: fromPrivateKey,
    publicKey: fromPublicKey,
  });

  if (!signature.sig) {
    throw new Error('Signature not found');
  }

  pactCommand.addSignatures({
    pubKey: fromPublicKey,
    sig: signature.sig ?? '',
  });

  console.log(`Sending transaction: ${pactCommand.code}`);
  const response = await pactCommand.send(API_HOST);
  // const response = await pactCommand.local(API_HOST);

  console.log('Send response: ', response);
  const requestKey = response.requestKeys[0];

  const pollResult = await pactCommand.pollUntil(API_HOST, {
    onPoll: async (transaction, pollRequest): Promise<void> => {
      console.log(`Polling ${requestKey}.\nStatus: ${transaction.status}`);
      console.log(await pollRequest);
    },
  });

  console.log('Polling Completed.');
  console.log(pollResult);
}
