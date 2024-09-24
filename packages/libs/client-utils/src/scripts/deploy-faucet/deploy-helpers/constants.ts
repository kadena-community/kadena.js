import type { ChainId } from '@kadena/types';
import { env } from './env';

export const CHAINWEB_HOST = env('CHAINWEB_HOST');
export const NETWORK_ID = env('NETWORK_ID');
export const CHAIN_IDS = env('CHAIN_IDS').split(',') as ChainId[];

export const GAS_PAYER = {
  ACCOUNT: env('GAS_PAYER_ACCOUNT'),
  PUBLIC_KEY: env('GAS_PAYER_PUBLIC_KEY'),
  SECRET_KEY: env('GAS_PAYER_SECRET_KEY'),
};
export const FAUCET_ADMINS: Array<{ name: string; publicKey: string }> = [
  {
    name: 'Javad Khalilian',
    publicKey:
      '89f0a840e3bab4c32e07b14862f0a0f414543da036ecf339d3ed7ec93fa4a41b',
  },
  {
    name: 'Hee Kyun Yun',
    publicKey:
      'dfb16b13e4032a6878fd98506b22cb0d6e5932c541e656b7ee5d69d72e6eb76e',
  },
  {
    name: 'Albert Groothedde',
    publicKey:
      '554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
  },
  {
    name: 'Andy Tang',
    publicKey:
      'fab92c47ccb1fdd25173e2981ebb29de989acea88792e34cc87298f6a1578842',
  },
  {
    name: 'Steven Straatemans',
    publicKey:
      '1c835d4e67917fd25781b11db1c12efbc4296c5c7fe981d35bbcf4a46a53441f',
  },
  {
    name: 'Randy Daal',
    publicKey:
      'c86613482e5821f477821fd89526dfaaf6759a6e581c421309bfe8e9dd52e280',
  },
  {
    name: 'Jermaine Jong',
    publicKey:
      'cbfdc18532f8986658145a82f7337e6dd1fd90d3c224f153c92bf8b0ec70b4be',
  },
];
export const FAUCET_GUARD_PREDICATE = 'keys-any';
