/* istanbul ignore file */
// this module is just a poc for the client

import { ICommand } from '../interfaces/ICommand';
import { Pact } from '../pact';

const { coin } = Pact.modules;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const getPact: any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pact: any = getPact({
  sign: (command: ICommand) => {
    // do the signing
  },
  host: 'http://url-of-the-pact-endpoint',
  chainId: '1',
  networkId: '1',
});

type ICapFn = (...args: Array<string | object>) => string;

pact
  .exec([
    coin.transfer('javad', 'albert', { decimal: '0.1' }),
    coin.transfer('albert', 'javad', { decimal: '0.1' }),
  ])
  .singer('javad', (withCapability: ICapFn) => [
    withCapability('coin.TRANSFER', 'javad', 'albert', { decimal: '0.1' }),
  ])
  .singer('javad', (withCapability: ICapFn) => [
    withCapability('coin.TRANSFER', 'albert', 'javad', { decimal: '0.1' }),
  ])
  .sing((signedCommand: ICapFn) => {
    console.log('user-singed', signedCommand);
  })
  .submit((requestKey: string) => {
    console.log('submitted', requestKey);
  })
  .pollStatus((requestKey: string) => {
    console.log('polling', requestKey);
  });
