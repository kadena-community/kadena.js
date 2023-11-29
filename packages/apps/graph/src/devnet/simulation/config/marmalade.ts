import { devnetConfig } from '../../config';
import { sender00 } from '../../helper';

export const marmaladeConfig = {
  sender_key: sender00.keys[0].publicKey,
  marmalade_user_key_1: '',
  marmalade_user_key_2: '',
  marmalade_namespace: '',
  is_upgrade: '',
  network: devnetConfig.NETWORK_ID,
  chain: devnetConfig.CHAIN_ID,
  sender: sender00.account,
  kip_namespace: '',
};
