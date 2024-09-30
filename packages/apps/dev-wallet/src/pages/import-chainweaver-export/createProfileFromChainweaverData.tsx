import { ChainweaverService } from '@/modules/key-source/hd-wallet/chainweaver';
import { defaultAccentColor } from '@/modules/layout/layout.provider';
import {
  INetwork,
  networkRepository,
} from '@/modules/network/network.repository';
import { ChainId } from '@kadena/client';
import { accountRepository } from '../../modules/account/account.repository';
import { keySourceManager } from '../../modules/key-source/key-source-manager';
import { createProfile } from '../../modules/wallet/wallet.service';

export async function createProfileFromChainweaverData(
  selectedOptions: {
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
  } = selectedOptions;

  // process networks
  const networks = await enrichNetworks(importedNetworks);
  // await Promise.all(
  //   networks.map(async (network) => {
  //     try {
  //       return await networkRepository.addNetwork(network);
  //     } catch (e) {
  //       // network already exists
  //     }
  //   }),
  // );

  // process profile
  const profile = await createProfile(
    profileName,
    password,
    networks,
    defaultAccentColor,
    {
      authMode: 'PASSWORD',
    },
  );

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

  // process accounts
  const networksList = await networkRepository.getNetworkList();
  await Promise.all(
    accounts.map(async (account) => {
      return await accountRepository.addAccount({
        address: account.account,
        chains: Array.from(new Array(20)).map((_, i) => ({
          chainId: i.toString() as ChainId,
          balance: '',
        })),
        uuid: crypto.randomUUID(),
        contract: 'coin',
        overallBalance: '',
        networkId:
          networksList.find((network) => network.name === account.network)
            ?.networkId ||
          (await networkRepository.getNetwork('mainnet01'))?.networkId ||
          '',
        profileId: profile.uuid,
        keysetId: cwWallet.uuid,
      });
    }),
  );

  // process tokens
  await Promise.all(
    tokens.map(async (token) => {
      try {
        return await accountRepository.addFungible({
          chainIds: Array.from(new Array(20)).map(
            (_, i) => i.toString() as ChainId,
          ),
          contract: token.namespace
            ? `${token.namespace}.${token.name}`
            : token.name,
          interface: 'fungible-v2',
          symbol: token.name === 'coin' ? 'KDA' : token.name,
          title: token.name,
        });
      } catch (e) {
        // token already exists
      }
    }),
  );
}

const enrichNetworks = async (
  importedNetworks: { network: string; hosts: string[] }[],
): Promise<INetwork[]> => {
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

      const networkId = hostsNodeVersions.find(
        (nodeVersion) => nodeVersion !== false && nodeVersion.length > 0,
      );

      if (networkId === undefined) {
        return false;
      }

      return networkId;
    }),
  );

  return importedNetworks
    .map((network, index) => ({
      ...network,
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
      }
    }) as INetwork[];
};
