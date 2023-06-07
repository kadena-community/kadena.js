import { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import { PactCommand } from '@kadena/client';
import { sign } from '@kadena/cryptography-utils';
import { PactNumber } from '@kadena/pactjs';
import { ChainId } from '@kadena/types';

import { getPublicKeys } from '../../services/accounts/get-public-keys';
import { generateApiHost } from '../utils/utils';

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
}: {
  fromAccount: string;
  fromChainId: ChainId;
  toAccount: string;
  toChainId: ChainId;
  amount: string;
  fromPrivateKey: string;
  networkId: ChainwebNetworkId;
}): Promise<PactCommand> {
  if (fromChainId === toChainId) {
    return transferCreate({
      fromAccount,
      toAccount,
      amount,
      fromPrivateKey,
      fromChainId,
      networkId,
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
  });
}

export async function transferCreate({
  fromAccount,
  fromChainId,
  toAccount,
  amount,
  fromPrivateKey,
  networkId,
}: {
  fromAccount: string;
  fromChainId: ChainId;
  toAccount: string;
  amount: string;
  fromPrivateKey: string;
  networkId: ChainwebNetworkId;
}): Promise<PactCommand> {
  if (isNaN(Number(amount))) {
    throw new Error('Amount must be a number');
  }

  const fromAccountGuard = await getPublicKeys(
    networkId,
    fromChainId,
    fromAccount,
  );
  if (fromAccountGuard === undefined) {
    throw new Error('Sender account does not exist');
  }

  const toAccountGuard = await getPublicKeys(networkId, fromChainId, toAccount);
  if (toAccountGuard === undefined) {
    throw new Error('Receiver account does not exist');
  }

  const pactCommand = new PactCommand();
  pactCommand.code = `(coin.transfer-create "${fromAccount}" "${toAccount}" (read-keyset "ks") ${new PactNumber(
    amount,
  ).toDecimal()})`;

  pactCommand
    .addCap('coin.GAS', fromAccountGuard.keys[0])
    .addCap(
      'coin.TRANSFER',
      fromAccountGuard.keys[0],
      fromAccount,
      toAccount,
      Number(new PactNumber(amount).toDecimal()),
    )
    .addData({ ks: { pred: toAccountGuard.pred, keys: toAccountGuard.keys } })
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
    publicKey: fromAccountGuard.keys[0],
  });

  if (signature.sig === undefined) {
    throw new Error('Failed to sign transaction');
  }

  pactCommand.addSignatures({
    pubKey: fromAccountGuard.keys[0],
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
}: {
  fromAccount: string;
  fromChainId: ChainId;
  toAccount: string;
  toChainId: ChainId;
  amount: string;
  fromPrivateKey: string;
  networkId: ChainwebNetworkId;
}): Promise<PactCommand> {
  const fromAccountGuard = await getPublicKeys(
    networkId,
    fromChainId,
    fromAccount,
  );
  if (fromAccountGuard === undefined) {
    throw new Error('Sender account does not exist');
  }

  const toAccountGuard = await getPublicKeys(networkId, toChainId, toAccount);
  if (toAccountGuard === undefined) {
    throw new Error('Sender account does not exist');
  }

  const pactCommand = new PactCommand();
  pactCommand.code = `(coin.transfer-crosschain "${fromAccount}" "${toAccount}" (read-keyset "ks") "${toChainId}" ${new PactNumber(
    amount,
  ).toDecimal()})`;

  pactCommand
    .addCap('coin.GAS', fromAccountGuard.keys[0])
    .addCap(
      'coin.TRANSFER_XCHAIN',
      fromAccountGuard.keys[0],
      fromAccount,
      toAccount,
      new PactNumber(amount).toPactDecimal(),
      toChainId,
    )
    .addData({ ks: { pred: toAccountGuard.pred, keys: toAccountGuard.keys } })
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
    publicKey: fromAccountGuard.keys[0],
  });

  if (signature.sig === undefined) {
    throw new Error('Failed to sign transaction');
  }

  pactCommand.addSignatures({
    pubKey: fromAccountGuard.keys[0],
    sig: signature.sig,
  });

  console.log(`Sending transaction: ${pactCommand.code}`);

  await pactCommand.send(generateApiHost(networkId, fromChainId));
  return pactCommand;
}
