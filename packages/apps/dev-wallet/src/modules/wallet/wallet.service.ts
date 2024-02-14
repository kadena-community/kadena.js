import {
  ChainId,
  IPactCommand,
  IUnsignedCommand,
  addSignatures,
} from '@kadena/client';
import { discoverAccount } from '@kadena/client-utils/coin';
import { WithEmitter, withEmitter } from '@kadena/client-utils/core';
import { kadenaDecrypt, kadenaEncrypt } from '@kadena/hd-wallet';

import { IAccount, accountRepository } from '../account/account.repository';
import { keySourceManager } from '../key-source/key-source-manager';
import { INetwork } from '../network/network.repository';
import {
  IKeyItem,
  IKeySource,
  IProfile,
  walletRepository,
} from './wallet.repository';

export function getProfile(profileId: string) {
  return walletRepository.getProfile(profileId);
}

export function getAccounts(profileId: string) {
  return walletRepository.getAccountsByProfileId(profileId);
}

export function sign(
  keySources: IKeySource[],
  onConnect: (keySource: IKeySource) => Promise<void>,
  TXs: IUnsignedCommand[],
) {
  const signedTx = Promise.all(
    TXs.map(async (Tx) => {
      const signatures = await Promise.all(
        keySources.map(async (keySource) => {
          const { keys: publicKeys, source } = keySource;
          const cmd: IPactCommand = JSON.parse(Tx.cmd);
          const relevantIndexes = cmd.signers
            .map(
              (signer) =>
                publicKeys.find((key) => key.publicKey === signer.pubKey)
                  ?.index,
            )
            .filter((index) => index !== undefined) as number[];

          const service = keySourceManager.get(source);

          if (!service.isReady()) {
            // call onConnect to connect to the keySource;
            // then the ui can prompt the user to unlock the wallet in case of hd-wallet
            await onConnect(keySource);
          }

          const signatures = await service.sign(
            Tx.hash,
            keySource.uuid,
            relevantIndexes,
          );

          return signatures;
        }),
      );
      return addSignatures(Tx, ...signatures.flat());
    }),
  );

  return signedTx;
}

export async function createProfile(
  profileName: string,
  password: string,
  networks: INetwork[],
) {
  const secretId = crypto.randomUUID();
  // create this in order to verify the password later
  const secret = await kadenaEncrypt(
    password,
    JSON.stringify({ secretId }),
    'buffer',
  );
  await walletRepository.addEncryptedValue(secretId, secret);
  const profile: IProfile = {
    uuid: crypto.randomUUID(),
    name: profileName,
    networks,
    secretId,
  };
  await walletRepository.addProfile(profile);
  return profile;
}

export const unlockProfile = async (profileId: string, password: string) => {
  try {
    const profile = await walletRepository.getProfile(profileId);
    const secret = await walletRepository.getEncryptedValue(profile.secretId);
    const decryptedSecret = await kadenaDecrypt(password, secret);
    const { secretId } = JSON.parse(new TextDecoder().decode(decryptedSecret));
    if (secretId === profile.secretId) {
      return profile;
    }
    return null;
  } catch (e) {
    return null;
  }
};

export async function createKey(keySource: IKeySource, quantity: number) {
  const service = keySourceManager.get(keySource.source);
  const keys = await service.createKey(keySource.uuid, quantity);
  return keys;
}

export async function createKAccount(
  profileId: string,
  networkId: string,
  publicKey: string,
  contract: string,
) {
  const account: IAccount = {
    uuid: crypto.randomUUID(),
    alias: '',
    profileId: profileId,
    address: `k:${publicKey}`,
    keysetGuard: {
      pred: 'keys-any',
      keys: [publicKey],
    },
    networkId,
    contracts: [contract],
  };

  await accountRepository.addAccount(account);
  return account;
}

export async function decryptSecret(password: string, secretId: string) {
  const encrypted = await walletRepository.getEncryptedValue(secretId);
  if (!encrypted) {
    throw new Error('No record found');
  }
  const decryptedBuffer = await kadenaDecrypt(password, encrypted);
  const mnemonic = new TextDecoder().decode(decryptedBuffer);
  return mnemonic;
}

export type IDiscoveredAccount = {
  chainId: ChainId;
  result:
    | undefined
    | {
        account: string;
        balance: string;
        guard: {
          keys: string[];
        };
      };
};

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
      networkId: string,
      keySourceId: string,
      profileId: string,
      numberOfKeys = 20,
      contract = 'coin',
    ) => {
      const result: Array<{
        key: IKeyItem;
        chainResult: IDiscoveredAccount[];
      }> = [];
      const keySource = await walletRepository.getKeySource(keySourceId);
      const keySourceService = keySourceManager.get(keySource.source);
      for (let i = 0; i < numberOfKeys; i++) {
        const [key] = await keySourceService.getPublicKey(keySource, i);
        if (!key) {
          return;
        }
        await emit('key-retrieved')(key);
        const chainResult = (await discoverAccount(
          `k:${key.publicKey}`,
          networkId,
          undefined,
          contract,
        )
          .on('chain-result', async (data) => {
            console.log('chain-result', data);
            await emit('chain-result')(data as IDiscoveredAccount);
          })
          .execute()) as IDiscoveredAccount[];

        result.push({ key, chainResult });
      }

      await emit('query-done')(result);

      const accounts = await Promise.all(
        result
          .filter(({ chainResult }) =>
            chainResult.find((r) => r.result && r.result.account),
          )
          .map(({ key }) =>
            createKAccount(profileId, networkId, key.publicKey, contract).catch(
              () => null,
            ),
          ),
      );

      await emit('accounts-saved')(accounts);

      return accounts;
    },
);
