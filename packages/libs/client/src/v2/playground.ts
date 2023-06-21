import {
  cmdBuilder,
  getModule,
  ICapabilityItem,
  ICommand,
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
  return { nonce: `kjs ${new Date().toISOString()}` };
};

const set = <T extends keyof ICommand>(
  item: T,
  value: ICommand[T],
): { [key in T]: ICommand[T] } => {
  return { [item]: value } as { [key in T]: ICommand[T] };
};

// use the payload type in the output cont/exec
// eslint-disable-next-line @rushstack/typedef-var
export const cmd = cmdBuilder(
  payload.exec([
    coin.transfer('javad', 'albert', { decimal: '0.1' }),
    test.changeAdmin('albert', 'javad'),
  ]),
  signer('javadPublicKey', (withCapability) => [
    withCapability('test.ADMIN'),
    withCapability('test.ADMIN'),
  ]),
  signer('albertPublicKey', (withCapability) => [
    withCapability('coin.TRANSFER', 'javad', 'albert', 12),
    withCapability('coin.TRANSFER', 'javad', 'albert', 12),
  ]),
  meta({ chainId: '1' }),
  nonce('kms'),
  set('networkId', 'mainnet04'),
);
