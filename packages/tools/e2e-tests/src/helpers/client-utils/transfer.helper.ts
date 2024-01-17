import {
  devnetHost,
  networkId,
} from '@fixtures/graph/testdata/constants/network';
import type { ICommandResult } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { transfer, transferCrossChain } from '@kadena/client-utils/coin';
import type { ChainId } from '@kadena/types';
import type { IAccount } from 'src/support/types/types';

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
  source: IAccount,
  target: IAccount,
  amount: string,
): Promise<ICommandResult> {
  const transferCrossChainTask = await transferCrossChain(
    {
      sender: {
        account: source.account,
        publicKeys: [source.keys[0].publicKey],
      },
      receiver: {
        account: target.account,
        keyset: {
          keys: [target.keys[0].publicKey],
          pred: 'keys-all',
        },
      },
      amount: amount,
      chainId: source.chainId,
      targetChainId: target.chainId,
      targetChainGasPayer: {
        account: source.account,
        publicKeys: [source.keys[0].publicKey],
      },
    },
    {
      host: devnetHost,
      defaults: {
        networkId: networkId,
      },
      sign: createSignWithKeypair([source.keys[0]]),
    },
  );
  const listenContinuation = await transferCrossChainTask.executeTo(
    'listen-continuation',
  );
  await transferCrossChainTask.executeTo();
  return listenContinuation;
}
