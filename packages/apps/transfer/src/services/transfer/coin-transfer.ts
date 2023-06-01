import { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import { PactCommand } from '@kadena/client';
import { sign } from '@kadena/cryptography-utils';
import { ChainId } from '@kadena/types';

import { convertDecimal, generateApiHost, onlyKey } from '../utils/utils';

const gasLimit = 2300;
const gasPrice = 0.00001;
const ttl = 28800;

export interface TransferResult {
  requestKey?: string;
  status?: string;
}

export async function transferCreate(
  fromAccount: string,
  toAccount: string,
  amount: string,
  fromPrivateKey: string,
  chainId: ChainId,
  networkId: ChainwebNetworkId,
): Promise<PactCommand> {
  if (isNaN(Number(amount))) {
    throw new Error('Amount must be a number');
  }

  const pactCommand = new PactCommand();
  pactCommand.code = `(coin.transfer-create "${fromAccount}" "${toAccount}" (read-keyset "ks") ${convertDecimal(
    amount,
  )})`;

  pactCommand
    .addCap('coin.GAS', onlyKey(fromAccount))
    .addCap(
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
      networkId,
    );

  pactCommand.createCommand();

  if (pactCommand.cmd === undefined) {
    throw new Error('Failed to create transaction');
  }

  const signature = sign(pactCommand.cmd, {
    secretKey: fromPrivateKey,
    publicKey: onlyKey(fromAccount),
  });

  if (signature.sig === undefined) {
    throw new Error('Failed to sign transaction');
  }

  pactCommand.addSignatures({
    pubKey: onlyKey(fromAccount),
    sig: signature.sig,
  });

  console.log(`Sending transaction: ${pactCommand.code}`);

  await pactCommand.send(generateApiHost(networkId, chainId));
  return pactCommand;
}

export async function safeTransferCreate(
  fromAccount: string,
  toAccount: string,
  amount: string,
  fromPrivateKey: string,
  toPrivateKey: string,
  chainId: ChainId,
  networkId: ChainwebNetworkId,
): Promise<PactCommand> {
  if (isNaN(Number(amount))) {
    throw new Error('Amount must be a number');
  }

  // sender need to send extra coins to the receiver which will be returned by the receiver
  const amountWithExtra = Number(amount) + 0.000000000001;

  const pactCommand = new PactCommand();
  pactCommand.code = `(coin.transfer-create "${fromAccount}" "${toAccount}" (read-keyset "ks") ${convertDecimal(
    amountWithExtra.toString(),
  )})(coin.transfer "${toAccount}" "${fromAccount}" ${convertDecimal(
    '0.000000000001',
  )})`;

  pactCommand
    .addCap('coin.GAS', onlyKey(fromAccount))
    .addCap(
      'coin.TRANSFER',
      onlyKey(fromAccount),
      fromAccount,
      toAccount,
      Number(amountWithExtra),
    )
    .addCap(
      'coin.TRANSFER',
      onlyKey(toAccount),
      toAccount,
      fromAccount,
      Number('0.1'),
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
      networkId,
    );

  pactCommand.createCommand();

  if (pactCommand.cmd === undefined) {
    throw new Error('Failed to create transaction');
  }

  const signatureSender = sign(pactCommand.cmd, {
    secretKey: fromPrivateKey,
    publicKey: onlyKey(fromAccount),
  });

  const signatureReceiver = sign(pactCommand.cmd, {
    secretKey: toPrivateKey,
    publicKey: onlyKey(toAccount),
  });

  if (
    signatureSender.sig === undefined ||
    signatureReceiver.sig === undefined
  ) {
    throw new Error('Failed to sign transaction');
  }

  pactCommand.addSignatures(
    {
      pubKey: onlyKey(fromAccount),
      sig: signatureSender.sig,
    },
    {
      pubKey: onlyKey(toAccount),
      sig: signatureReceiver.sig,
    },
  );

  console.log(`Sending transaction: ${pactCommand.code}`);

  await pactCommand.send(generateApiHost(networkId, chainId));
  return pactCommand;
}
