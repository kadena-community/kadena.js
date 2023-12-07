import type { ITransactionDescriptor } from '@kadena/client';
import { ICommandResult, createSignWithKeypair } from '@kadena/client';
import { transfer, transferCrossChain } from '@kadena/client-utils/coin';
import type { ChainId, ICommand } from '@kadena/types';
import { expect } from 'vitest';
import type { IAccountWithSecretKey } from '../testdata/constants/accounts';
import { devnetHost, networkId } from '../testdata/constants/network';

export async function transferFunds2(
  source: IAccountWithSecretKey,
  target: IAccountWithSecretKey,
  amount: string,
  chainId: ChainId,
) {
  const result = await transfer(
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
  ).execute();
  expect(result).toBe('Write succeeded');
}


export function transferFunds(
  source: IAccountWithSecretKey,
  target: IAccountWithSecretKey,
  amount: string,
  chainId: ChainId,
) {
  const result = new Promise<ICommandResult>((resolve, reject)=> {
   return transfer(
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
    ).on('listen', resolve)
    .execute()
    .catch(reject)
  })
  return result
}


export function transferFundsCrossChain(
  source: IAccountWithSecretKey,
  target: IAccountWithSecretKey,
  amount: string,
  sourecChain: ChainId,
  targetChain: ChainId
) {
  const result = new Promise<ICommandResult>((resolve, reject)=> {
    return transferCrossChain(
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
        chainId: sourecChain,
        targetChainId: targetChain,
      },
      {
        host: devnetHost,
        defaults: {
          networkId: networkId,
        },
        sign: createSignWithKeypair([source]),
      },
    ).on('listen', resolve)
    .execute()
    .catch(reject)
  })
  return result
}
