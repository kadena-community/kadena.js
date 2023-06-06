import { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import { PactCommand } from '@kadena/client';
import { sign } from '@kadena/cryptography-utils';
import { createExp, PactNumber } from '@kadena/pactjs';
import { ChainId } from '@kadena/types';

import { getPublicKey } from '../accounts/get-public-key';
import {
  convertDecimal,
  decimalFormatter,
  generateApiHost,
} from '../utils/utils';

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

  const fromPublicKey = await getPublicKey(networkId, chainId, fromAccount);
  const toPublicKey = await getPublicKey(networkId, chainId, toAccount);

  const pactCommand = new PactCommand();

  pactCommand.code = `(coin.transfer-create "${fromAccount}" "${toAccount}" (read-keyset "ks") ${convertDecimal(
    amount,
  )})`;

  pactCommand
    .addCap('coin.GAS', fromPublicKey)
    .addCap(
      'coin.TRANSFER',
      fromPublicKey,
      fromAccount,
      toAccount,
      Number(amount),
    )
    .addData({ ks: { pred: 'keys-all', keys: [toPublicKey] } })
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
    publicKey: fromPublicKey,
  });

  if (signature.sig === undefined) {
    throw new Error('Failed to sign transaction');
  }

  pactCommand.addSignatures({
    pubKey: fromPublicKey,
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

  const fromPublicKey = await getPublicKey(networkId, chainId, fromAccount);
  const toPublicKey = await getPublicKey(networkId, chainId, toAccount);

  const extra = parseFloat('0.000000000001');
  const extraStringified = decimalFormatter.format(extra);

  // sender need to send extra coins to the receiver which will be returned by the receiver
  const amountWithExtra = decimalFormatter.format(Number(amount) + extra);

  const pactCommand = new PactCommand();
  pactCommand.code = `(coin.transfer-create "${fromAccount}" "${toAccount}" (read-keyset "ks") ${amountWithExtra})(coin.transfer "${toAccount}" "${fromAccount}" ${extraStringified})`;

  pactCommand
    .addCap('coin.GAS', fromPublicKey)
    .addCap(
      'coin.TRANSFER',
      fromPublicKey,
      fromAccount,
      toAccount,
      parseFloat(amountWithExtra),
    )
    .addCap('coin.TRANSFER', toPublicKey, toAccount, fromAccount, extra)
    .addData({ ks: { pred: 'keys-all', keys: [toPublicKey] } })
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
    publicKey: fromPublicKey,
  });

  const signatureReceiver = sign(pactCommand.cmd, {
    secretKey: toPrivateKey,
    publicKey: toPublicKey,
  });

  if (
    signatureSender.sig === undefined ||
    signatureReceiver.sig === undefined
  ) {
    throw new Error('Failed to sign transaction');
  }

  pactCommand.addSignatures(
    {
      pubKey: fromPublicKey,
      sig: signatureSender.sig,
    },
    {
      pubKey: toPublicKey,
      sig: signatureReceiver.sig,
    },
  );

  console.log(`Sending transaction: ${pactCommand.code}`);

  await pactCommand.send(generateApiHost(networkId, chainId));
  return pactCommand;
}
