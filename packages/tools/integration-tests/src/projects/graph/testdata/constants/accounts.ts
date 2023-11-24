import { genKeyPair } from '@kadena/cryptography-utils';

// the pre-funded account that will be used to fund other accounts
export const sender00Account = {
  account: 'sender00',
  publicKey: '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
  chainId: '0',
  guard: '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
  // this is here only for testing purposes. in a real world scenario, the secret key should never be exposed
  secretKey: '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
};

const generatedAccountOne = genKeyPair()
export const accountOne = {
  account: `k:${generatedAccountOne.publicKey}`,
  publicKey: generatedAccountOne.publicKey,
  chainId: '0',
  guard: generatedAccountOne.publicKey,
  // this is here only for testing purposes. in a real world scenario, the secret key should never be exposed
  secretKey: generatedAccountOne.secretKey
};

const generatedAccountTwo = genKeyPair()
export const accountTwo = {
  account: `k:${generatedAccountTwo.publicKey}`,
  publicKey: generatedAccountTwo.publicKey,
  chainId: '1',
  guard: generatedAccountTwo.publicKey,
  // this is here only for testing purposes. in a real world scenario, the secret key should never be exposed
  secretKey: generatedAccountTwo.secretKey
};
