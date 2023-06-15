/* eslint-disable @kadena-dev/no-eslint-disable */
/* eslint-disable @rushstack/typedef-var */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { ICommand } from '@kadena/types';

import {
  cmdBuilder,
  getModule,
  ICapabilityItem,
  meta,
  payload,
  signer,
} from './pact';

interface ITransferCapability {
  (name: 'coin.GAS'): ICapabilityItem;
  (
    name: 'coin.TRANSFER',
    from: string,
    to: string,
    amount: number,
  ): ICapabilityItem;
}

interface IAdminCapability {
  (name: 'test.ADMIN'): ICapabilityItem;
}

interface ICoin {
  transfer: (
    from: string,
    to: string,
    amount: { decimal: string },
  ) => string & {
    capability: ITransferCapability;
  };
}

interface ITest {
  changeAdmin: (
    from: string,
    to: string,
  ) => string & {
    capability: IAdminCapability;
  };
}

const coin: ICoin = getModule('coin');
const test: ITest = getModule('coin');

const nonce = (input: string) => (cmd: Partial<ICommand>) => {
  return `kjs ${new Date().toISOString()}`;
};

// use the payload type in the output cont/exec
export const cmd = cmdBuilder(
  payload.exec([
    coin.transfer('javad', 'albert', { decimal: '0.1' }),
    coin.transfer('albert', 'javad', { decimal: '0.1' }),
  ]),
  signer('javadPublicKey', (withCapability) => [
    withCapability('coin.TRANSFER', 'javad', 'albert', 12),
  ]),
  signer('albertPublicKey', ({ withCapability }) => [
    withCapability('coin.TRANSFER', 'javad', 'albert', 12),
  ]),
  meta({ chainId: '1' }),
);

// it can change the command
declare const sign: (command: ICommand) => Promise<string[]>;

// van not change
declare const quicksign: (command: string) => Promise<string[]>;
