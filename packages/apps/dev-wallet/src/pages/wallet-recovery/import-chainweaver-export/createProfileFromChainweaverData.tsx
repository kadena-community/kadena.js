import { config } from '@/config';
import {
  accountRepository,
  IAccount,
  IKeySet,
} from '@/modules/account/account.repository';
import { ChainweaverService } from '@/modules/key-source/hd-wallet/chainweaver';
import { keySourceManager } from '@/modules/key-source/key-source-manager';
import {
  INetwork,
  networkRepository,
} from '@/modules/network/network.repository';
import { createProfile } from '@/modules/wallet/wallet.service';
import { kadenaEntropyToMnemonic } from '@kadena/hd-wallet';

export async function createProfileFromChainweaverData(
  cwImport: {
    accounts: { network: string; account: string; notes?: string }[];
    keyPairs: { index: number; private: string; public: string }[];
    tokens: { network: string; namespace: string | null; name: string }[];
    networks: { network: string; hosts: string[] }[];
    rootKey: string;
  },
  password: string,
  profileName: string,
) {
  const {
    accounts,
    keyPairs,
    tokens,
    networks: importedNetworks,
    rootKey,
  } = cwImport;
  let profileId: string | undefined = undefined;

  // process networks
  const networks = await enrichNetworks(importedNetworks);
  await Promise.all(
    networks.map(async (network) => {
      try {
        return await networkRepository.addNetwork(network);
      } catch (e) {
        // network already exists
        console.log(`Network already exists: ${network.networkId}`);
      }
    }),
  );

  const rootKeyBuffer = new TextEncoder().encode(rootKey);
  console.log('rootKeyBuffer length', rootKeyBuffer.length);
  const rootKeyHash = await crypto.subtle.digest('SHA-256', rootKeyBuffer);
  const mnemonic = await kadenaEntropyToMnemonic(new Uint8Array(rootKeyHash));

  try {
    // process profile
    const profile = await createProfile(
      profileName,
      password,
      networks,
      config.defaultAccentColor,
      {
        authMode: 'PASSWORD',
        rememberPassword: 'session',
      },
      mnemonic,
    );
    console.log(`new profile with id ${profile.uuid}`);
    profileId = profile.uuid;

    // process keypairs
    // two variants:
    //   1. start with root key and create using indexes (preferred)
    //   2. only use keypairs
    const keyManager = (await keySourceManager.get(
      'HD-chainweaver',
    )) as ChainweaverService;

    const cwWallet = await keyManager.import(
      profile.uuid,
      rootKey,
      password,
      keyPairs,
    );

    console.log('processing accounts');

    // process accounts
    await Promise.all(
      accounts.map(async (account) => {
        console.log('account', account);

        if (
          !cwWallet.keys.find(
            (k) => k.publicKey === account.account.split('k:')[1],
          )?.secretId
        ) {
          console.log(
            `Skipping import of account ${account.account} as it is not in the keypair list. This is an account to be added to address book`,
          );
          return;
        }

        const keySet: IKeySet = {
          guard: {
            keys: [account.account.split('k:')[1]],
            pred: 'keys-all',
          },
          principal: account.account,
          profileId: profile.uuid,
          uuid: crypto.randomUUID(),
        };

        console.warn(`Network ${account.network} not found`);

        const dbNetwork = networks.find(
          (network) => network.name === account.network,
        );
        const networkId = dbNetwork?.uuid;

        if (networkId === undefined) {
          // TODO: ask the user for the network with `account.network` name and
          // ask them to provide a host and networkId
          console.warn(
            `Skipping import... Network ${account.network} not found for account ${account.account}.`,
          );
          return;
        }

        const newAccount: IAccount = {
          uuid: crypto.randomUUID(),
          profileId: profile.uuid,
          address: account.account,
          keysetId: keySet.uuid,
          networkUUID: dbNetwork!.uuid,
          contract: 'coin',
          chains: [],
          overallBalance: '0',
          alias: account.notes || '',
        };

        return Promise.all([
          await accountRepository.addKeyset(keySet),
          await accountRepository.addAccount(newAccount),
        ]);
      }),
    );
    console.log('finished processing accounts');

    console.log('processing tokens');
    // process tokens
    await Promise.all(
      tokens.map(async (token) => {
        try {
          return await accountRepository.addFungible({
            contract: token.namespace
              ? `${token.namespace}.${token.name}`
              : token.name,
            interface: 'fungible-v2',
            symbol: token.name === 'coin' ? 'KDA' : token.name,
            title: token.name,
            networkUUIDs: [
              networks.find((network) => network.networkId === token.network)!
                .uuid,
            ],
          });
        } catch (e) {
          // token already exists
          console.warn(`Skipping... Token ${token.name} already exists`);
        }
      }),
    );
    console.log('finished processing tokens');
  } catch (e) {
    // TODO: remove added data
    console.warn(`Error while importing: ${e}`);
  }
  console.log('Profile created:', profileId);
  return profileId;
}

const enrichNetworks = async (
  importedNetworks: { network: string; hosts: string[] }[],
): Promise<(INetwork & { name: string })[]> => {
  const networkIds = await Promise.all(
    importedNetworks.map(async (network) => {
      const hostsNodeVersions = await Promise.all<string | false>(
        network.hosts.map(async (host) => {
          if (!host.startsWith('http')) {
            if (host.startsWith('localhost')) {
              host = 'http://' + host;
            } else {
              host = 'https://' + host;
            }
          }
          return fetch(host + '/info')
            .then((res) => res.json())
            .then((info) => info.nodeVersion)
            .catch(() => false);
        }),
      );

      let networkId = hostsNodeVersions.find(
        (nodeVersion) => nodeVersion !== false && nodeVersion.length > 0,
      );

      if (networkId === undefined) {
        console.log('Network ID not found for network', network.network);
        console.log('requesting');
        const res = window.prompt(
          `Network ID not found for network ${network.network}
          ${network.hosts.join(', \n')}
          (empty to skip importing this network)`,
        );
        if (res === null || res === '' || res === undefined) {
          return false;
        }
        networkId = res;
      }
      return networkId;
    }),
  );

  return importedNetworks
    .map((network, index) => ({
      ...network,
      name: network.network,
      uuid: crypto.randomUUID(),
      networkId: networkIds[index],
      hosts: network.hosts.map((host) => ({
        url: host,
        submit: true,
        read: true,
        confirm: true,
      })),
    }))
    .filter((network) => {
      if (!network.networkId) {
        console.warn(
          `Network ${network.network} has no node version. Tried calling /info on hosts`,
        );
        return false;
      } else {
        return true;
      }
    }) as (INetwork & { name: string })[];
};
