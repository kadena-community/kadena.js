import { sender00 } from '@devnet/utils';
import { dotenv } from '@utils/dotenv';

/* Define the arguments for the marmalade contracts: these values are going
to be replaced in the marmalade templates and code files  */
export const argumentConfig = {
  sender_key: sender00.keys[0].publicKey,
  marmalade_namespace: 'marmalade-v2',
  marmalade_sale_namespace: 'marmalade-sale',
  is_upgrade: 'false',
  network: dotenv.NETWORK_ID,
  chain: dotenv.SIMULATE_DEFAULT_CHAIN_ID,
  sender: sender00.account,
  kip_namespace: 'kip',
  signer: sender00.keys[0].publicKey,
  marmalade_user_key_1: sender00.keys[0].publicKey,
  marmalade_user_key_2: sender00.keys[0].publicKey,
};

/* Define the order of the namespaces in the marmalade contracts: the smart contracts
related to the namespace of the first item are going to be deployed first, then the second,
and so on  */
export const marmaladeNamespaceOrder = ['marmalade-v2', 'marmalade-sale'];
