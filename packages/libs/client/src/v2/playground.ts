import { getClient } from './client/client';
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

const commandWithSignatures = { cmd: cmd.stringify(), hash: 'str', sigs: [''] };

const getHostUrl = (networkId: string, chainId: string) => {
  switch (networkId) {
    case 'devnet':
      return `http://localhost/${chainId}/pact`;
    case 'l2network':
      return `http://the-l2-server/${chainId}/pact`;
    case 'mainnet01':
      return `https://api.chainweb.com/chainweb/0.0/mainnet01/chain/${chainId}/pact`;
    case 'testnet04':
      return `https://api.chainweb.com/chainweb/0.0/testnet04/chain/${chainId}/pact`;
    default:
      throw new Error(`UNKNOWN_NETWORK_ID: ${networkId}`);
  }
};

const { local, submit, pollStatus, pollSpv } = getClient(getHostUrl);

async function localExample() {
  const result = await local(commandWithSignatures);
  return result;
}

async function submitExample() {
  const [requestKeys, poll] = await submit([commandWithSignatures]);
  console.log(requestKeys);
  const results = await poll({
    onTry: (number) => {
      console.log('try number', number);
    },
  });
  return results;
}

async function pollExample() {
  const someRequestKeys = ['key1', 'key2'];
  const status = await pollStatus(someRequestKeys, {
    networkId: 'testnet04',
    chainId: '01',
  });
  return status;
}

async function spvExample() {
  const someRequestKeys = 'key1';
  const status = await pollSpv(someRequestKeys, '01', {
    networkId: 'testnet04',
    chainId: '01',
  });
  return status;
}
