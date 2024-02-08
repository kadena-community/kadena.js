import type { ChainId, IKeyPair } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { transferCreate } from '@kadena/client-utils/coin';
import type { INetworkCreateOptions } from '../../networks/utils/networkHelpers.js';
import type { Predicate } from '../types.js';

interface IAccount {
  accountName: string;
  publicKey: string;
  secretKey: string;
}

export async function createAndTransferFund({
  senderAccount,
  gasPayerAccount,
  receiverAccount,
  config,
}: {
  senderAccount: IKeyPair & { accountName: string };
  gasPayerAccount: Omit<IAccount, 'secretKey'>;
  receiverAccount: {
    name: string;
  };
  config: {
    amount: string;
    contract: string;
    chainId: ChainId;
    networkConfig: INetworkCreateOptions;
    publicKeys: string[];
    predicate: string;
  };
}): Promise<string | undefined> {
  const { chainId, amount, contract, networkConfig, publicKeys, predicate } =
    config;
  try {
    const result = await transferCreate(
      {
        sender: {
          account: senderAccount.accountName,
          publicKeys: [senderAccount.publicKey],
        },
        receiver: {
          account: receiverAccount.name,
          keyset: {
            pred: predicate as Predicate,
            keys: publicKeys,
          },
        },
        gasPayer: {
          account: gasPayerAccount.accountName,
          publicKeys: [gasPayerAccount.publicKey],
        },
        chainId: chainId,
        amount: amount,
        contract: contract,
      },
      {
        host: networkConfig.networkHost,
        defaults: {
          networkId: networkConfig.networkId,
          meta: {
            chainId: chainId as ChainId,
          },
        },
        sign: createSignWithKeypair({
          publicKey: senderAccount.publicKey,
          secretKey: senderAccount.secretKey,
        }),
      },
    )
    .on('sign', (data) => console.log({ sign: data}))
    .on('submit', (data) => console.log({ submit: data}))
    .on('listen', (data) => console.log({ listen: data}))
    .execute();

    return result;
  } catch (error) {
    throw new Error(`Failed to create account and transfer fund: ${error}`);
  }
}
