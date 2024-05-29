import type { IAccount, IAccountWithSecretKey } from '../support/interfaces';

// the pre-funded account that will be used to fund other accounts
export const sender00Account: IAccountWithSecretKey = {
  account: 'sender00',
  publicKey: '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
  chainId: '0',
  guard: '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
  // this is here only for testing purposes. in a real world scenario, the secret key should never be exposed
  secretKey: '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
};

export const sourceAccount: IAccountWithSecretKey = {
  account: 'k:5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937',
  publicKey: '5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937',
  chainId: '0',
  guard: '5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937',
  // this is here only for testing purposes. in a real world scenario, the secret key should never be exposed
  secretKey: 'e97b30547784bf05eb71a765b1d45127ed89d9b3c0cf21b71a107efb170eed33',
};

export const targetAccount: IAccount = {
  account: 'k:5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937',
  publicKey: '5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937',
  chainId: '1',
  guard: '5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937',
};
export const secondaryTargetAccount: IAccountWithSecretKey = {
  account: 'k:5f6f02565cf70fe29a43eb251028673ceb43263707a2d6eee929a97690223b87',
  publicKey: '5f6f02565cf70fe29a43eb251028673ceb43263707a2d6eee929a97690223b87',
  chainId: '0',
  guard: '5f6f02565cf70fe29a43eb251028673ceb43263707a2d6eee929a97690223b87',
  // this is here only for testing purposes. in a real world scenario, the secret key should never be exposed
  secretKey: 'a3c949df6ff96f4b82a9c7f2e44f5adccaf0e4278eef2000164383912b6fd8b4',
};
