import { ChainId } from '@kadena/types';
import { IAccount } from '../../../core/utils/helpers';

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
export const defaultNetworkId = 'fast-development';

/* Defines the arguments for the marmalade contracts: these values are going
to be replaced in the marmalade templates and code files  */
export const defaultArguments = {
  sender_key: defaultAccount.publicKeys?.[0] ?? '',
  marmalade_namespace: 'marmalade-v2',
  is_upgrade: 'false',
  network: defaultNetworkId,
  chain: defaultChainId,
  sender: defaultAccount.account,
  kip_namespace: 'kip',
  signer: defaultAccount.publicKeys?.[0] ?? '',
  marmalade_user_key_1: defaultAccount.publicKeys?.[0] ?? '',
  marmalade_user_key_2: defaultAccount.publicKeys?.[0] ?? '',
};
/* Define the order of the namespaces in the marmalade contracts: the smart contracts
related to the namespace of the first item are going to be deployed first, then the second,
and so on  */
export const defaultNamespaceDeployOrder = ['marmalade-v2', 'marmalade-sale'];
