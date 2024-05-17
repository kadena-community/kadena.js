import { sender00 } from '@devnet/utils';
import { dotenv } from '@utils/dotenv';

/* Define the arguments for the marmalade contracts: these values are going
to be replaced in the marmalade templates and code files  */
export const argumentConfig = {
  sender_key: sender00.keys[0].publicKey,
  marmalade_namespace: 'marmalade-v2',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  marmalade_sale_namespace: 'marmalade-sale',
  is_upgrade: 'false',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  upgrade_version_1: 'false',
  network: 'development', // Gets overwritten with the actual network id when called
  chain: dotenv.SIMULATE_DEFAULT_CHAIN_ID,
  sender: sender00.account,
  kip_namespace: 'kip',
  signer: sender00.keys[0].publicKey,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  marmalade_user_key_1: sender00.keys[0].publicKey,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  marmalade_user_key_2: sender00.keys[0].publicKey,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  kip_ns_user_key_1: sender00.keys[0].publicKey,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  kip_ns_user_key_2: sender00.keys[0].publicKey,
};

export const argumentConfigVersion1Upgrade = {
  ...argumentConfig,
  is_upgrade: 'true',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  upgrade_version_1: 'true',
};
