import type { ChainId } from '@kadena/types';
import { env } from './env';

export const CHAINWEB_HOST = env('CHAINWEB_HOST');
export const NETWORK_ID = env('NETWORK_ID');
export const CHAIN_IDS = env('CHAIN_IDS').split(',') as ChainId[];

export const PRIVATE_SIGNER = {
  PUBLIC_KEY: env('PRIVATE_SIGNER_PUBLIC_KEY'),
  SECRET_KEY: env('PRIVATE_SIGNER_SECRET_KEY'),
};

export const GAS_PAYER = {
  ACCOUNT: env('GAS_PAYER_ACCOUNT', `k:${PRIVATE_SIGNER.PUBLIC_KEY}`),
  PUBLIC_KEY: env('GAS_PAYER_PUBLIC_KEY', PRIVATE_SIGNER.PUBLIC_KEY),
  SECRET_KEY: env('GAS_PAYER_SECRET_KEY', PRIVATE_SIGNER.SECRET_KEY),
};

export const DEBUG_MODE =
  env('DEBUG_MODE') === 'true' || env('DEBUG_MODE') === '1';

export const UPGRADE = env('UPGRADE') === 'true' || env('UPGRADE') === '1';

export const FAUCET_ADMINS = [
  '89f0a840e3bab4c32e07b14862f0a0f414543da036ecf339d3ed7ec93fa4a41b',
  '154d6f239864c19c43ef377c03cc8df8e0d1e792a143a01423503028ce963afa',
  'dfb16b13e4032a6878fd98506b22cb0d6e5932c541e656b7ee5d69d72e6eb76e',
  '554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
  'fab92c47ccb1fdd25173e2981ebb29de989acea88792e34cc87298f6a1578842',
  '1c835d4e67917fd25781b11db1c12efbc4296c5c7fe981d35bbcf4a46a53441f',
  'c86613482e5821f477821fd89526dfaaf6759a6e581c421309bfe8e9dd52e280',
  'cbfdc18532f8986658145a82f7337e6dd1fd90d3c224f153c92bf8b0ec70b4be',
  '3e83213bedf6be0aaf8ed3f8e72ffb9a240930b8698b9646e8d913b61c93e4ab',
];

export const FAUCET_GUARD_PREDICATE = 'keys-any';

export const TASK = env('TASK') ?? 'deploy';

export const INCOMING_AMOUNT: string = env('INCOMING_AMOUNT', '100');

export const TO_FUND_PUBLIC_KEY = env(
  'TO_FUND_PUBLIC_KEY',
  PRIVATE_SIGNER.PUBLIC_KEY,
);
