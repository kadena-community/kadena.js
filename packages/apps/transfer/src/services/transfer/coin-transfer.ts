import { PactCommand } from '@kadena/client';
import { sign } from '@kadena/cryptography-utils';

import { onlyKey } from '../utils/utils';

const NETWORK_ID = 'testnet04';
const chainId = '1';
export const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${chainId}/pact`;
const gasLimit = 2300;
const gasPrice = 0.00001;
const ttl = 28800;

export interface TransferResult {
  requestKey?: string;
  status?: string;
}

export async function makeTransferCreate(
  fromAccount: string,
  toAccount: string,
  amount: string,
  fromPrivateKey: string,
): Promise<PactCommand> {
  const pactCommand = new PactCommand();
  pactCommand.code = `(coin.transfer-create "${fromAccount}" "${toAccount}" (read-keyset "ks") ${amount})`;

  pactCommand
    .addCap('coin.GAS', onlyKey(fromAccount))
    .addCap<any>(
      'coin.TRANSFER',
      onlyKey(fromAccount),
      fromAccount,
      toAccount,
      Number(amount),
    )
    .addData({ ks: { pred: 'keys-all', keys: [onlyKey(toAccount)] } })
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
    publicKey: onlyKey(fromAccount),
  });

  if (signature.sig === undefined) {
    throw new Error('Failed to sign transaction');
  }

  pactCommand.addSignatures({
    pubKey: onlyKey(fromAccount),
    sig: signature.sig ?? '',
  });

  console.log(`Sending transaction: ${pactCommand.code}`);

  await pactCommand.send(API_HOST);
  return pactCommand;
}
