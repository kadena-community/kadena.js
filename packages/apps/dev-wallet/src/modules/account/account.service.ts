import { discoverAccount } from '@kadena/client-utils/coin';
import {
  dirtyReadClient,
  WithEmitter,
  withEmitter,
} from '@kadena/client-utils/core';
import { PactNumber } from '@kadena/pactjs';

import { keySourceManager } from '../key-source/key-source-manager';
import { accountRepository, IAccount, IKeySet } from './account.repository';

import {
  createSignWithKeypair,
  createTransaction,
  type BuiltInPredicate,
  type ChainId,
} from '@kadena/client';
import {
  fundExistingAccountOnTestnetCommand,
  fundNewAccountOnTestnetCommand,
  readHistory,
} from '@kadena/client-utils/faucet';
import { genKeyPair } from '@kadena/cryptography-utils';
import { transactionRepository } from '../transaction/transaction.repository';
import type { IKeyItem, IKeySource } from '../wallet/wallet.repository';

import * as transactionService from '@/modules/transaction/transaction.service';
import { execution } from '@kadena/client/fp';
import { INetwork, networkRepository } from '../network/network.repository';
import { UUID } from '../types';

export type IDiscoveredAccount = {
  chainId: ChainId;
  result:
    | undefined
    | {
        account: string;
        balance: string;
        guard: {
          keys: string[];
          pred: BuiltInPredicate;
        };
      };
};

export async function createKAccount(
  profileId: string,
  networkUUID: UUID,
  publicKey: string,
  contract: string = 'coin',
  chains: Array<{ chainId: ChainId; balance: string }> = [],
) {
  const keyset: IKeySet = {
    principal: `k:${publicKey}`,
    uuid: crypto.randomUUID(),
    profileId,
    alias: '',
    guard: {
      pred: 'keys-all',
      keys: [publicKey],
    },
  };
  const account: IAccount = {
    uuid: crypto.randomUUID(),
    profileId: profileId,
    address: `k:${publicKey}`,
    keysetId: keyset.uuid,
    networkUUID,
    contract,
    chains,
    overallBalance: chains.reduce(
      (acc, { balance }) => new PactNumber(balance).plus(acc).toDecimal(),
      '0',
    ),
  };

  await accountRepository.addAccount(account);
  await accountRepository.addKeyset(keyset);
  return account;
}

// TODO: use graphql to fetch all relevant accounts
export const accountDiscovery = (
  withEmitter as unknown as WithEmitter<
    [
      { event: 'key-retrieved'; data: IKeyItem },
      { event: 'chain-result'; data: IDiscoveredAccount },
      {
        event: 'query-done';
        data: Array<{
          key: IKeyItem;
          chainResult: IDiscoveredAccount[];
        }>;
      },
      { event: 'accounts-saved'; data: IAccount[] },
    ]
  >
)(
  (emit) =>
    async (
      network: INetwork,
      keySource: IKeySource,
      profileId: string,
      numberOfKeys = 20,
      contract = 'coin',
    ) => {
      if (keySource.source === 'web-authn') {
        throw new Error('Account discovery not supported for web-authn');
      }
      const keySourceService = await keySourceManager.get(keySource.source);
      const accounts: IAccount[] = [];
      const keysets: IKeySet[] = [];
      const usedKeys: IKeyItem[] = [];
      for (let i = 0; i < numberOfKeys; i++) {
        const key = await keySourceService.getPublicKey(keySource, i);
        if (!key) {
          return;
        }
        await emit('key-retrieved')(key);
        const chainResult = (await discoverAccount(
          `k:${key.publicKey}`,
          network.networkId,
          undefined,
          contract,
        )
          .on('chain-result', async (data) => {
            await emit('chain-result')(data as IDiscoveredAccount);
          })
          .execute()) as IDiscoveredAccount[];

        if (chainResult.filter(({ result }) => Boolean(result)).length > 0) {
          usedKeys.push(key);
          const keyset: IKeySet = {
            uuid: crypto.randomUUID(),
            principal: `k:${key.publicKey}`,
            profileId,
            guard: {
              keys: [key.publicKey],
              pred: 'keys-all',
            },
            alias: '',
          };
          keysets.push(keyset);
          accounts.push({
            uuid: crypto.randomUUID(),
            profileId,
            networkUUID: network.uuid,
            contract,
            keysetId: keyset.uuid,
            address: `k:${key.publicKey}`,
            chains: chainResult
              .filter(({ result }) => Boolean(result))
              .map(({ chainId, result }) => ({
                chainId,
                balance: result!.balance || '0',
              })),
            overallBalance: chainResult.reduce(
              (acc, { result }) =>
                result?.balance
                  ? new PactNumber(result.balance).plus(acc).toDecimal()
                  : acc,
              '0',
            ),
          });
        }
      }

      await emit('query-done')(accounts);

      // store keys; key creation needs to be in sequence so I used a for loop instead of Promise.all
      for (const key of usedKeys) {
        await keySourceService.createKey(keySource.uuid, key.index as number);
      }

      // store accounts
      await Promise.all([
        ...accounts.map(async (account) =>
          accountRepository.addAccount(account),
        ),
        ...keysets.map(async (keyset) =>
          accountRepository.addKeyset(keyset).catch(console.log),
        ),
      ]);

      keySourceService.clearCache();
      await emit('accounts-saved')(accounts);

      return accounts;
    },
);

export const syncAccount = async (account: IAccount) => {
  console.log('syncing account', account.address);
  const network = await networkRepository.getNetwork(account.networkUUID);
  const updatedAccount = { ...account };

  const chainResult = (await discoverAccount(
    updatedAccount.address,
    network.networkId,
    undefined,
    updatedAccount.contract,
  )
    .execute()
    .catch((error) =>
      console.error('DISCOVERY ERROR', error),
    )) as IDiscoveredAccount[];

  console.log('chainResult', account.address, chainResult);

  updatedAccount.chains = chainResult
    .filter(({ result }) => Boolean(result))
    .map(({ chainId, result }) => ({
      chainId,
      balance: result!.balance
        ? new PactNumber(result!.balance).toString()
        : '0',
    }));

  updatedAccount.overallBalance = chainResult.reduce(
    (acc, { result }) =>
      result?.balance
        ? new PactNumber(result.balance).plus(acc).toDecimal()
        : acc,
    '0',
  );

  await accountRepository.updateAccount(updatedAccount);
  console.log('updated account', updatedAccount);
  return updatedAccount;
};

export const syncAllAccounts = async (profileId: string, networkUUID: UUID) => {
  const accounts = await accountRepository.getAccountsByProfileId(
    profileId,
    networkUUID,
  );
  console.log('syncing accounts', accounts);
  return Promise.all(accounts.map(syncAccount));
};

// TODO: update this to work with both testnet04 and testnet05
export async function fundAccount({
  address,
  keyset,
  profileId,
  network,
  chainId,
}: Pick<IAccount, 'address' | 'keyset' | 'profileId'> & {
  chainId: ChainId;
  network: INetwork;
}) {
  if (!keyset) {
    throw new Error('No keyset found');
  }
  if (!network.faucetContract) {
    throw new Error(`No faucet contract in ${network.networkId}`);
  }

  const randomKeyPair = genKeyPair();

  const faucetAccount = (await dirtyReadClient({
    defaults: {
      networkId: network.networkId,
      meta: {
        chainId: chainId as ChainId,
      },
    },
  })(
    execution(`${network.faucetContract}.FAUCET_ACCOUNT`),
  ).execute()) as string;

  const isCreated = await readHistory(
    address,
    chainId as ChainId,
    network.faucetContract,
    network.networkId,
  )
    .then(() => true)
    .catch(() => false);

  const command = isCreated
    ? fundExistingAccountOnTestnetCommand({
        account: address,
        signerKeys: [randomKeyPair.publicKey],
        amount: 20,
        chainId: chainId as ChainId,
        faucetAccount,
        networkId: network.networkId,
        contract: network.faucetContract,
      })
    : fundNewAccountOnTestnetCommand({
        account: address,
        keyset: keyset?.guard,
        signerKeys: [randomKeyPair.publicKey],
        amount: 20,
        chainId: chainId as ChainId,
        faucetAccount,
        networkId: network.networkId,
        contract: network.faucetContract,
      });

  const tx = createTransaction(command());

  const signedTx = await createSignWithKeypair(randomKeyPair)(tx);

  const groupId = crypto.randomUUID();

  const result = await transactionService.addTransaction({
    transaction: signedTx,
    profileId,
    networkUUID: network.uuid,
    groupId,
  });

  const updatedTransaction = {
    ...result,
    status: 'signed',
  } as const;

  await transactionRepository.updateTransaction(updatedTransaction);

  return updatedTransaction;
}
