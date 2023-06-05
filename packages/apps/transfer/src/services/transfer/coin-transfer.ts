import { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import { PactCommand } from '@kadena/client';
import { sign } from '@kadena/cryptography-utils';
import { PactNumber } from '@kadena/pactjs';
import { ChainId } from '@kadena/types';

import { generateApiHost, onlyKey } from '../utils/utils';

const gasLimit: number = 2300;
const gasPrice: number = 0.00001;
const ttl: number = 28800;

export interface TransferResult {
  requestKey?: string;
  status?: string;
}

export async function coinTransfer({
  fromAccount,
  fromChainId,
  toAccount,
  toChainId,
  amount,
  fromPrivateKey,
  networkId,
  predicate = 'keys-all',
  keys = [onlyKey(toAccount)],
}: {
  fromAccount: string;
  fromChainId: ChainId;
  toAccount: string;
  toChainId: ChainId;
  amount: string;
  fromPrivateKey: string;
  networkId: ChainwebNetworkId;
  predicate?: string;
  keys?: string[];
}): Promise<PactCommand> {
  if (fromChainId === toChainId) {
    return transferCreate({
      fromAccount,
      toAccount,
      amount,
      fromPrivateKey,
      fromChainId,
      networkId,
      predicate,
      keys,
    });
  }

  return crossTransfer({
    fromAccount,
    fromChainId,
    toAccount,
    toChainId,
    amount,
    fromPrivateKey,
    networkId,
    predicate,
    keys,
  });
}

export async function transferCreate({
  fromAccount,
  fromChainId,
  toAccount,
  amount,
  fromPrivateKey,
  networkId,
  predicate,
  keys,
}: {
  fromAccount: string;
  fromChainId: ChainId;
  toAccount: string;
  amount: string;
  fromPrivateKey: string;
  networkId: ChainwebNetworkId;
  predicate: string;
  keys: string[];
}): Promise<PactCommand> {
  if (isNaN(Number(amount))) {
    throw new Error('Amount must be a number');
  }

  const pactCommand = new PactCommand();
  pactCommand.code = `(coin.transfer-create "${fromAccount}" "${toAccount}" (read-keyset "ks") ${new PactNumber(
    amount,
  ).toDecimal()})`;

  pactCommand
    .addCap('coin.GAS', onlyKey(fromAccount))
    .addCap(
      'coin.TRANSFER',
      onlyKey(fromAccount),
      fromAccount,
      toAccount,
      Number(new PactNumber(amount).toDecimal()),
    )
    .addData({ ks: { pred: predicate, keys: keys } })
    .setMeta(
      {
        gasLimit: gasLimit,
        gasPrice: gasPrice,
        ttl: ttl,
        chainId: fromChainId,
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

  await pactCommand.send(generateApiHost(networkId, fromChainId));
  return pactCommand;
}

export async function crossTransfer({
  fromAccount,
  fromChainId,
  toAccount,
  toChainId,
  amount,
  fromPrivateKey,
  networkId,
  predicate,
  keys,
}: {
  fromAccount: string;
  fromChainId: ChainId;
  toAccount: string;
  toChainId: ChainId;
  amount: string;
  fromPrivateKey: string;
  networkId: ChainwebNetworkId;
  predicate: string;
  keys: string[];
}): Promise<PactCommand> {
  const pactCommand = new PactCommand();
  pactCommand.code = `(coin.transfer-crosschain "${fromAccount}" "${toAccount}" (read-keyset "ks") "${toChainId}" ${new PactNumber(
    amount,
  ).toDecimal()})`;

  pactCommand
    .addCap('coin.GAS', onlyKey(fromAccount))
    .addCap(
      'coin.TRANSFER_XCHAIN',
      onlyKey(fromAccount),
      fromAccount,
      toAccount,
      new PactNumber(amount).toPactDecimal(),
      toChainId,
    )
    .addData({ ks: { pred: predicate, keys: keys } })
    .setMeta(
      {
        gasLimit: gasLimit,
        gasPrice: gasPrice,
        ttl: ttl,
        chainId: fromChainId,
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

  await pactCommand.send(generateApiHost(networkId, fromChainId));
  return pactCommand;
}
