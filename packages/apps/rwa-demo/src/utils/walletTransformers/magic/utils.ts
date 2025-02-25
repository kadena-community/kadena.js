import { env } from '@/utils/env';
import { KadenaExtension } from '@magic-ext/kadena';
import type { Extension } from 'magic-sdk';
import { Magic } from 'magic-sdk';

export const magicInit = (): Magic => {
  const kdaExtension = new KadenaExtension({
    rpcUrl: env.CHAINWEBAPIURL,
    chainId: env.CHAINID,
    networkId: env.NETWORKID,
    createAccountsOnChain: true,
  }) as unknown as Extension<string>;

  const magic = new Magic(env.MAGIC_APIKEY, {
    extensions: [kdaExtension],
  });

  return magic;
};
