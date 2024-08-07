import { createSignWithKeypair } from '@kadena/client';
import type { ChainId } from '@kadena/types';
import type { IAccount, IClientConfig } from '../../../core/utils/helpers';
import type {
  ILocalConfig,
  INamespaceConfig,
  IRemoteConfig,
  IRepositoryConfig,
} from './config';

export interface IAccountWithSecretKey extends IAccount {
  secretKey: string;
}

export const defaultAccount: IAccountWithSecretKey = {
  account: 'sender00',
  publicKeys: [
    '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
  ],
  secretKey: '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
};

export const defaultChainId: ChainId = '0';
export const defaultNetworkId = 'development';
export const defaultNetworkHost = 'http://localhost:8080';

/**
 * Defines the arguments for the marmalade contracts: these values are going
 * to be replaced in the marmalade templates and code files
 */
export const defaultArguments = {
  sender_key: defaultAccount.publicKeys?.[0] ?? '',
  marmalade_namespace: 'marmalade-v2',
  marmalade_sale_namespace: 'marmalade-sale',
  is_upgrade: 'false',
  upgrade_version_1: 'false',
  network: defaultNetworkId,
  chain: defaultChainId,
  sender: defaultAccount.account,
  kip_namespace: 'kip',
  signer: defaultAccount.publicKeys?.[0] ?? '',
  marmalade_user_key_1: defaultAccount.publicKeys?.[0] ?? '',
  marmalade_user_key_2: defaultAccount.publicKeys?.[0] ?? '',
  kip_ns_user_key_1: defaultAccount.publicKeys?.[0] ?? '',
  kip_ns_user_key_2: defaultAccount.publicKeys?.[0] ?? '',
};

export const defaultNamespaceConfig: INamespaceConfig[] = [
  {
    file: 'ns-marmalade.pact',
    namespaces: ['marmalade-v2', 'marmalade-sale', 'kip', 'util'],
  },
  {
    file: 'ns-contract-admin.pact',
    namespaces: ['marmalade-v2', 'marmalade-sale'],
  },
  { file: 'guards1.pact', namespaces: ['util'] },
];

/* Default values for repository configuration */
export const defaultRepositoryConfig: IRepositoryConfig = {
  owner: 'kadena-io',
  name: 'marmalade',
  branch: 'main',
};

/* Default values for local configuration */
export const defaultLocalConfig: ILocalConfig = {
  templatePath: 'temp',
  codeFilesPath: 'temp',
  namespacePath: 'temp',
};

/* Default values for remote configuration */
export const defaultRemoteConfig: IRemoteConfig = {
  templatePath: 'pact/yaml',
  namespacePaths: ['pact/marmalade-ns', 'pact/util'],
  templateExtension: 'yaml',
  codefileExtension: 'pact',
  exclude: ['data', 'sample'],
};

/**
 * By default the client configuration will point to localhost:8080 and use sender00
 * as the default account
 */

const defaultPublicKey = defaultAccount.publicKeys?.[0] ?? '';

export const defaultClientConfig: IClientConfig = {
  sign: createSignWithKeypair({
    publicKey:
      typeof defaultPublicKey === 'string'
        ? defaultPublicKey
        : defaultPublicKey.pubKey,
    secretKey: defaultAccount.secretKey,
  }),
  host: defaultNetworkHost,
};
