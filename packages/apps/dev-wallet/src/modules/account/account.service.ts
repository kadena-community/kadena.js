import { discoverAccount } from '@kadena/client-utils/coin';
import {
  dirtyReadClient,
  WithEmitter,
  withEmitter,
} from '@kadena/client-utils/core';
import { PactNumber } from '@kadena/pactjs';

import { keySourceManager } from '../key-source/key-source-manager';
import {
  accountRepository,
  IAccount,
  IKeySet,
  IWatchedAccount,
} from './account.repository';

import {
  createSignWithKeypair,
  createTransaction,
  ISigner,
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
  const account: IAccount = {
    uuid: crypto.randomUUID(),
    alias: alias || '',
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
      const saveCallbacks: Array<() => Promise<void>> = [];
      for (let i = 0; i < numberOfKeys; i++) {
        const key = await keySourceService.getPublicKey(keySource, i);
        if (!key) {
          return;
        }
        await emit('key-retrieved')(key);
        const principal = `k:${key.publicKey}`;
        const chainResult = (await discoverAccount(
          principal,
          network.networkId,
          undefined,
          contract,
        )
          .on('chain-result', async (data) => {
            await emit('chain-result')(data as IDiscoveredAccount);
          })
          .execute()) as IDiscoveredAccount[];

        if (chainResult.filter(({ result }) => Boolean(result)).length > 0) {
          const availableKeyset = await accountRepository.getKeysetByPrincipal(
            principal,
            profileId,
          );
          usedKeys.push(key);
          const keyset: IKeySet = availableKeyset || {
            uuid: crypto.randomUUID(),
            principal,
            profileId,
            guard: {
              keys: [key.publicKey],
              pred: 'keys-all',
            },
            alias: '',
          };
          if (!availableKeyset) {
            keysets.push(keyset);
          }
          const account: IAccount = {
            uuid: crypto.randomUUID(),
            profileId,
            networkUUID: network.uuid,
            contract,
            keysetId: keyset.uuid,
            keyset,
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
          };
          accounts.push(account);
          saveCallbacks.push(async () => {
            if (!keySource.keys.find((k) => k.publicKey === key.publicKey)) {
              await keySourceService.createKey(
                keySource.uuid,
                key.index as number,
              );
            }
            if (!availableKeyset) {
              await accountRepository.addKeyset(keyset);
            }
            await accountRepository.addAccount(account);
          });
        }
      }

      await emit('query-done')(accounts);

      await Promise.all(saveCallbacks.map((cb) => cb().catch(console.error)));

      keySourceService.clearCache();
      await emit('accounts-saved')(accounts);

      return accounts;
    },
);

interface Guard {
  keys: ISigner[];
  pred: BuiltInPredicate;
}

export const hasSameGuard = (a?: Guard, b?: Guard) => {
  const getKeys = (key: ISigner) =>
    typeof key === 'string' ? key : key.pubKey;
  const aKeys = a ? a.keys.map(getKeys).sort() : [];

  const bKeys = b ? b.keys.map(getKeys).sort() : [];
  return (
    aKeys.length === bKeys.length &&
    aKeys.every((key) => bKeys.includes(key)) &&
    a?.pred === b?.pred
  );
};

export const syncAccount = async (account: IAccount | IWatchedAccount) => {
  const network = await networkRepository.getNetwork(account.networkUUID);
  const patch: Partial<IAccount | IWatchedAccount> = {};

  const chainResult = (await discoverAccount(
    account.address,
    network.networkId,
    undefined,
    account.contract,
  )
    .execute()
    .catch((error) =>
      console.error('DISCOVERY ERROR', error),
    )) as IDiscoveredAccount[];

  const filteredResult = chainResult.filter(
    ({ result }) =>
      Boolean(result) && hasSameGuard(result?.guard, account.keyset?.guard),
  );

  patch.chains = filteredResult.map(({ chainId, result }) => ({
    chainId,
    balance: result!.balance ? new PactNumber(result!.balance).toString() : '0',
  }));

  patch.overallBalance = filteredResult.reduce(
    (acc, { result }) =>
      result?.balance
        ? new PactNumber(result.balance).plus(acc).toDecimal()
        : acc,
    '0',
  );
  patch.syncTime = Date.now();
  if ('watched' in account && account.watched) {
    return accountRepository.patchWatchedAccount(account.uuid, patch);
  }
  return accountRepository.patchAccount(
    account.uuid,
    patch as Partial<IAccount>,
  );
};

export const syncAllAccounts = async (profileId: string, networkUUID: UUID) => {
  const accounts = await accountRepository.getAccountsByProfileId(
    profileId,
    networkUUID,
  );
  const watchedAccounts = await accountRepository.getWatchedAccountsByProfileId(
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
      'watched' in account
        ? accountRepository.patchWatchedAccount(account.uuid, { syncTime: now })
        : accountRepository.patchAccount(account.uuid, { syncTime: now }),
    ),
  );

  for (const account of accountsToSync) {
    result.push(await syncAccount(account));
  }

  return result;
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
