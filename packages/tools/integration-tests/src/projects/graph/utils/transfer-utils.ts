import type { ICommandResult } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { transfer, transferCrossChain } from '@kadena/client-utils/coin';
import { waitForEvent } from '@kadena/client-utils/core';
import type { ChainId } from '@kadena/types';
import type { IAccountWithSecretKey } from '../testdata/constants/accounts';
import { devnetHost, networkId } from '../testdata/constants/network';

export function transferFunds(
  source: IAccountWithSecretKey,
  target: IAccountWithSecretKey,
  amount: string,
  chainId: ChainId,
): Promise<ICommandResult> {
  return waitForEvent(
    'listen',
    transfer(
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
    ),
  );
}

export function transferFundsCrossChain(
  source: IAccountWithSecretKey,
  target: IAccountWithSecretKey,
  amount: string,
  sourceChain: ChainId,
  targetChain: ChainId,
): Promise<ICommandResult> {
  return waitForEvent(
    'listen-continuation',
    transferCrossChain(
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
    ),
  );
}
