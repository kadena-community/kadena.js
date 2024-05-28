import type { ICommandResult } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { transfer, transferCrossChain } from '@kadena/client-utils/coin';
import type { ChainId } from '@kadena/types';
import { devnetHost, networkId } from '../../constants/network.constants';
import type { IAccount } from '../../types/account.types';

export async function transferFunds(
  source: IAccount,
  target: IAccount,
  amount: string,
  chainId: ChainId,
): Promise<ICommandResult> {
  const transferTask = transfer(
    {
      sender: {
        account: source.account,
        publicKeys: [source.keys[0].publicKey],
      },
      receiver: target.account,
      amount: amount,
      gasPayer: {
        account: source.account,
        publicKeys: [source.keys[0].publicKey],
      },
      chainId: chainId,
    },
    {
      host: devnetHost,
      defaults: {
        networkId: networkId,
      },
      sign: createSignWithKeypair([source.keys[0]]),
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
  sourceChain: ChainId,
  targetChain: ChainId,
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
      chainId: sourceChain,
      targetChainId: targetChain,
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function initiateCrossChainTransfer(
  source: IAccount,
  target: IAccount,
  amount: string,
  sourceChain: ChainId,
  targetChain: ChainId,
) {
  return transferCrossChain(
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
      chainId: sourceChain,
      targetChainId: targetChain,
    },
    {
      host: devnetHost,
      defaults: {
        networkId: networkId,
      },
      sign: createSignWithKeypair([source.keys[0]]),
    },
  );
}
