/* istanbul ignore file */
// this module is just a poc for the client

import { ICommand } from '@kadena/types';

import { Pact } from '../pact';

const { coin } = Pact.modules;

declare const getPact: any;

const pact: any = getPact({
  sign: (command: ICommand) => {
    // do the signing
  },
  host: 'http://url-of-the-pact-endpoint',
  chainId: '1',
  networkId: '1',
});

// safe transfer
const result = pact
  .exec([
    coin.transfer('javad', 'albert', { decimal: '0.1' }),
    coin.transfer('albert', 'javad', { decimal: '0.1' }),
  ])
  .singer('javad', (withCapability: any) => [
    withCapability('coin.TRANSFER', 'javad', 'albert', { decimal: '0.1' }),
  ])
  .singer('javad', (withCapability: any) => [
    withCapability('coin.TRANSFER', 'albert', 'javad', { decimal: '0.1' }),
  ])
  .sing((signedCommand: any) => {
    console.log('user-singed', signedCommand);
  })
  .submit((requestKey: string) => {
    console.log('submitted', requestKey);
  })
  .pollStatus((requestKey: string) => {
    console.log('polling', requestKey);
  });
