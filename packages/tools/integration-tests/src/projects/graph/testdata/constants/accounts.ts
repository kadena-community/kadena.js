import type { ChainId } from "@kadena/types";

export interface IAccount {
  account: string,
  publicKey: string,
  chainId: ChainId,
  guard: string,
  secretKey: string,
}

// the pre-funded account that will be used to fund other accounts
export const sender00Account: IAccount = {
  account: 'sender00',
  publicKey: '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
  chainId: '0',
  guard: '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
  // this is here only for testing purposes. in a real world scenario, the secret key should never be exposed
  secretKey: '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
};

export const accountOne: IAccount = {
  account: `k:bc7bc6e180551e42f831bed08ca82c137ead7a8a2b174724ca917a73e62e4eb8`,
  publicKey: "bc7bc6e180551e42f831bed08ca82c137ead7a8a2b174724ca917a73e62e4eb8",
  chainId: '0',
  guard: "bc7bc6e180551e42f831bed08ca82c137ead7a8a2b174724ca917a73e62e4eb8",
  // this is here only for testing purposes. in a real world scenario, the secret key should never be exposed
  secretKey: "5ced0aeb842dcc6b071d5401987c87117229f73b1a284b7718e449f6c38fc951"
};

export const accountTwo: IAccount = {
  account: `k:5c177efe2c16d87b59dda80e4ead49abb7cfec64a99bc1535ca2070abed73d50`,
  publicKey: "5c177efe2c16d87b59dda80e4ead49abb7cfec64a99bc1535ca2070abed73d50",
  chainId: '1',
  guard: "5c177efe2c16d87b59dda80e4ead49abb7cfec64a99bc1535ca2070abed73d50s",
  // this is here only for testing purposes. in a real world scenario, the secret key should never be exposed
  secretKey: "8b454fa5aa80870dfa83dfe6a8ed739dd2291a06fdeb70380d0e1efa7c07955c"
};
