import type { IAccountWithSecretKey } from '@fixtures/graph/testdata/constants/accounts';
import {
  devnetHost,
  networkId,
} from '@fixtures/graph/testdata/constants/network';
import type { ICommandResult } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { transfer, transferCrossChain } from '@kadena/client-utils/coin';
import type { ChainId } from '@kadena/types';

export async function transferFunds(
  source: IAccountWithSecretKey,
  target: IAccountWithSecretKey,
  amount: string,
  chainId: ChainId,
): Promise<ICommandResult> {
  const transferTask = await transfer(
    {
      sender: { account: source.account, publicKeys: [source.publicKey] },
      receiver: target.account,
      amount: amount,
      gasPayer: { account: source.account, publicKeys: [source.publicKey] },
      chainId: chainId,
    },
    {
      host: devnetHost,
      defaults: {
        networkId: networkId,
      },
      sign: createSignWithKeypair([source]),
    },
  );
  const listen = await transferTask.executeTo('listen');
  await transferTask.execute();
  return listen;
}

export async function transferFundsCrossChain(
  source: IAccountWithSecretKey,
  target: IAccountWithSecretKey,
  amount: string,
  sourceChain: ChainId,
  targetChain: ChainId,
): Promise<ICommandResult> {
  const transferCrossChainTask = await transferCrossChain(
    {
      sender: {
        account: source.account,
        publicKeys: [source.publicKey],
      },
      receiver: {
        account: target.account,
        keyset: {
          keys: [target.publicKey],
          pred: 'keys-all',
        },
      },
      amount: amount,
      chainId: sourceChain,
      targetChainId: targetChain,
      targetChainGasPayer: {
        account: source.account,
        publicKeys: [source.publicKey],
      },
    },
    {
      host: devnetHost,
      defaults: {
        networkId: networkId,
      },
      sign: createSignWithKeypair([source]),
    },
  );
  const listenContinuation = await transferCrossChainTask.executeTo(
    'listen-continuation',
  );
  await transferCrossChainTask.executeTo();
  return listenContinuation;
}
