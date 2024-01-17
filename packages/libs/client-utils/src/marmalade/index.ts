import { createSignWithKeypair } from '@kadena/client';
import { ChainId } from '@kadena/types';
import { IClientConfig } from '../core/utils/helpers';
import { createToken } from './create-token';
import { createTokenId } from './create-token-id';

console.log('marmalade');

const input = {
  uri: Date.now().toString(),
  precision: 0,
  chainId: '0' as ChainId,
  creator: {
    account: 'sender00',
    keyset: {
      pred: 'keys-all' as const,
      keys: [
        '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
      ],
    },
  },
};

const config: IClientConfig = {
  host: 'http://localhost:8080',
  defaults: {
    networkId: 'fast-development',
  },
  sign: createSignWithKeypair({
    publicKey:
      '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
    secretKey:
      '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
  }),
};

const tokenId = createTokenId(input, config).execute();
tokenId.then((res) => {
  console.log(res);
  if (res === undefined) return;
  const input2 = { ...input, tokenId: res };

  const tokenCreate = createToken(input2, config).executeTo('listen');

  tokenCreate.then((res: any) => {
    console.log(res);
  });
});
