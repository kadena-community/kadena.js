import { devnetConfig } from '../../config';
import { sender00 } from '../../helper';

/* Define the arguments for the marmalade contracts: these values are going
to be replaced in the marmalade templates and code files  */
export const argumentConfig = {
  sender_key: sender00.keys[0].publicKey,
  marmalade_namespace: 'marmalade-v2',
  is_upgrade: 'false',
  network: devnetConfig.NETWORK_ID,
  chain: devnetConfig.CHAIN_ID,
  sender: sender00.account,
  kip_namespace: 'kip',
  signer: sender00.keys[0].publicKey,
};
