import { discoverAccount, transferAllCommand } from '@kadena/client-utils/coin';
import {
  dirtyReadClient,
  estimateGas,
  WithEmitter,
  withEmitter,
} from '@kadena/client-utils/core';
import { PactNumber } from '@kadena/pactjs';

import { keySourceManager } from '../key-source/key-source-manager';
import {
  accountRepository,
  IAccount,
  IGuard,
  IKeySet,
  IOwnedAccount,
} from './account.repository';

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

import { config } from '@/config';
import * as transactionService from '@/modules/transaction/transaction.service';
import { sleep } from '@/utils/helpers';
import {
  composePactCommand,
  execution,
  setMeta,
  setNetworkId,
} from '@kadena/client/fp';
import { INetwork, networkRepository } from '../network/network.repository';
import { UUID } from '../types';
import { isKeysetGuard } from './guards';
import { IRetrievedAccount } from './IRetrievedAccount';

export type IWalletDiscoveredAccount = {
  chainId: ChainId;
  networkUUID: UUID;
  result:
    | undefined
    | {
        account: string;
        balance: string;
        guard: {
          principal: string;
          keys: string[];
          pred: BuiltInPredicate;
        };
      };
};

export async function createKAccount({
  profileId,
  networkUUID,
  publicKey,
  contract = 'coin',
  chains = [],
  alias = '',
}: {
  profileId: string;
  networkUUID: UUID;
  publicKey: string;
  contract: string;
  chains?: Array<{ chainId: ChainId; balance: string }>;
  alias?: string;
}) {
  const keyset: IKeySet = {
    principal: `k:${publicKey}`,
    uuid: crypto.randomUUID(),
    profileId,
    alias: alias || '',
    guard: {
      pred: 'keys-all',
      keys: [publicKey],
    },
  };
  const account: IOwnedAccount = {
    uuid: crypto.randomUUID(),
    alias: alias || '',
    profileId: profileId,
    address: `k:${publicKey}`,
    keysetId: keyset.uuid,
    guard: {
      pred: 'keys-all',
      keys: [publicKey],
      principal: `k:${publicKey}`,
    },
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
      { event: 'chain-result'; data: IWalletDiscoveredAccount },
      {
        event: 'query-done';
        data: Array<{
          key: IKeyItem;
          chainResult: IWalletDiscoveredAccount[];
        }>;
      },
      { event: 'accounts-saved'; data: IOwnedAccount[] },
    ]
  >
)(
  (emit) =>
    async (
      networks: INetwork[],
      keySource: IKeySource,
      profileId: string,
      numberOfKeys = 20,
      contract = 'coin',
    ) => {
      if (keySource.source === 'web-authn') {
        throw new Error('Account discovery not supported for web-authn');
      }
      const keySourceService = await keySourceManager.get(keySource.source);
      const accounts: IOwnedAccount[] = [];
      const usedKeys: IKeyItem[] = [];
      const saveCallbacks: Array<() => Promise<void>> = [];
      for (let i = 0; i < numberOfKeys; i++) {
        const key = await keySourceService.getPublicKey(keySource, i);
        if (!key) {
          return;
        }
        await emit('key-retrieved')(key);
        const principal = `k:${key.publicKey}`;
        for (const network of networks) {
          if (network.networkId === 'mainnet01') {
            await sleep(config.ACCOUNTS.RATE_LIMIT);
          }

          const chainResult = await discoverAccount(
            principal,
            network.networkId,
            undefined,
            contract,
          )
            .on('chain-result', async (data) => {
              await emit('chain-result')({
                chainId: data.chainId,
                networkUUID: network.uuid,
                result: data.result
                  ? {
                      ...data.result,
                      guard: data.result.details.guard
                        ? {
                            ...data.result.details.guard,
                            principal: data.result.principal,
                          }
                        : undefined,
                      balance: data.result.details.balance,
                    }
                  : undefined,
              });
            })
            .execute()
            .catch((error) => {
              console.log('DISCOVERY_ERROR', error);
              return [];
            });

          if (chainResult.filter(({ result }) => Boolean(result)).length > 0) {
            usedKeys.push(key);
            const account: IOwnedAccount = {
              uuid: crypto.randomUUID(),
              profileId,
              networkUUID: network.uuid,
              contract,
              guard: {
                keys: [key.publicKey],
                pred: 'keys-all',
                principal,
              },
              address: `k:${key.publicKey}`,
              chains: chainResult
                .filter(({ result }) => Boolean(result))
                .map(({ chainId, result }) => ({
                  chainId: chainId!,
                  balance:
                    new PactNumber(result!.details.balance).toDecimal() ||
                    '0.0',
                })),
              overallBalance: chainResult.reduce(
                (acc, { result }) =>
                  result && result.details.balance
                    ? new PactNumber(result.details.balance)
                        .plus(acc)
                        .toDecimal()
                    : acc,
                '0',
              ),
            };
            accounts.push(account);
            saveCallbacks.push(async () => {
              if (!keySource.keys.find((k) => k.publicKey === key.publicKey)) {
                await keySourceService.createKey(
                  keySource.uuid,
                  key.index as number,
                );
              }
              await accountRepository.addAccount(account);
            });
          }
        }
      }

      await emit('query-done')(accounts);

      for (const cb of saveCallbacks) {
        await cb().catch(console.error);
      }

      keySourceService.clearCache();
      await emit('accounts-saved')(accounts);

      return accounts;
    },
);

export const hasSameGuard = (a?: IGuard, b?: IGuard) => {
  if (a?.principal && b?.principal) {
    return a?.principal === b?.principal;
  }
  if (a && b && isKeysetGuard(a) && isKeysetGuard(b)) {
    return a.keys.every((key) => b.keys.includes(key)) && a.pred === b.pred;
  }
  return false;
};

export const syncAccount = async (account: IAccount) => {
  const network = await networkRepository.getNetwork(account.networkUUID);
  const patch: Partial<IAccount> = {};

  const chainResult = await discoverAccount(
    account.address,
    network.networkId,
    undefined,
    account.contract,
  )
    .execute()
    .catch((error) => {
      console.log('DISCOVERY_ERROR', error);
      return undefined;
    });

  if (!chainResult) {
    return account;
  }

  const filteredResult = chainResult.filter(
    ({ result }) =>
      Boolean(result) &&
      hasSameGuard(
        { ...result?.details.guard, principal: result?.principal },
        account.guard,
      ),
  );

  patch.chains = filteredResult.map(({ chainId, result }) => ({
    chainId: chainId!,
    balance: result!.details.balance
      ? new PactNumber(result!.details.balance).toString()
      : '0',
  }));

  patch.overallBalance = filteredResult.reduce(
    (acc, { result }) =>
      result?.details.balance
        ? new PactNumber(result.details.balance).plus(acc).toDecimal()
        : acc,
    '0',
  );
  patch.syncTime = Date.now();
  return accountRepository.patchAccount(
    account.uuid,
    patch as Partial<IOwnedAccount>,
  );
};

export const syncAllAccounts = async (profileId: string, networkUUID: UUID) => {
  const accounts = await accountRepository.getAccountsByProfileId(
    profileId,
    networkUUID,
  );

  const network = await networkRepository.getNetwork(networkUUID);

  const watchedAccounts = await accountRepository.getAccountsByProfileId(
    profileId,
    networkUUID,
  );
  // sync all accounts sequentially to avoid rate limiting
  const result = [];
  const now = Date.now();
  const accountsToSync = [...accounts, ...watchedAccounts].filter(
    (account) =>
      !account.syncTime ||
      account.syncTime < now - config.ACCOUNTS.SYNC_INTERVAL,
  );

  await Promise.all(
    accountsToSync.map((account) =>
      accountRepository.patchAccount(account.uuid, { syncTime: now }),
    ),
  );

  for (const account of accountsToSync) {
    result.push(await syncAccount(account));
    if (network.networkId === 'mainnet01') {
      await sleep(config.ACCOUNTS.RATE_LIMIT);
    }
  }

  return result;
};

// TODO: update this to work with both testnet04 and testnet05
export async function fundAccount({
  address,
  guard,
  profileId,
  network,
  chainId,
}: Pick<IOwnedAccount, 'address' | 'guard' | 'profileId'> & {
  chainId: ChainId;
  network: INetwork;
}) {
  if (!guard) {
    throw new Error('No guard found');
  }
  if (!isKeysetGuard(guard)) {
    throw new Error('Guard is not a keyset guard');
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
        keyset: guard,
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

export async function createMigrateAccountTransactions(
  source: IOwnedAccount,
  target: IRetrievedAccount,
  ownedKeys: string[],
) {
  if (!isKeysetGuard(target.guard)) {
    throw new Error('Target guard is not a keyset guard');
  }
  const targetGuard = target.guard;
  const network = await networkRepository.getNetwork(source.networkUUID);
  const transactions = await Promise.all(
    source.chains.map(async (chain) => {
      const sender = {
        account: source.address,
        publicKeys:
          source.guard.pred === 'keys-any' && ownedKeys.length
            ? ownedKeys
            : source.guard.pred === 'keys-2' && ownedKeys.length >= 2
              ? ownedKeys
              : source.guard.keys,
      };
      const command = transferAllCommand({
        sender,
        receiver: {
          account: target.address,
          keyset: targetGuard,
        },
        gasPayer: sender,
        chainId: chain.chainId,
        contract: source.contract,
        amount: chain.balance,
      });
      const gas = await estimateGas(command);
      const updatedCommand = composePactCommand(
        command,
        setNetworkId(network.networkId),
        setMeta({ ...gas }),
      );
      return createTransaction(updatedCommand());
    }),
  );
  const groupId = crypto.randomUUID();
  await Promise.all(
    transactions.map(async (tx) => {
      transactionService.addTransaction({
        transaction: tx,
        profileId: source.profileId,
        networkUUID: source.networkUUID,
        groupId,
      });
    }),
  );
  return groupId;
}
