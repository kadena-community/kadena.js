// Test Case 1 - 01-system.yaml code from https://github.com/kadena-io/pact/blob/master/examples/accounts/scripts/01-system.yaml
import type {
  EnvData,
  ICommand,
  ICommandPayload,
  IKeyPair,
  IMetaData,
  Nonce,
  PactCode,
  SignatureWithHash,
} from '@kadena/types';

export const keyPair: IKeyPair = {
  publicKey: 'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  secretKey: '8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332',
};

export const keyPairs: Array<IKeyPair> = [keyPair];
export const nonce: Nonce = 'step01';

export const pactCode: PactCode =
  '(define-keyset \'k (read-keyset "accounts-admin-keyset"))\n(module system \'k\n  (defun get-system-time ()\n    (time "2017-10-31T12:00:00Z")))\n(get-system-time)';

export const envData: EnvData = {
  'accounts-admin-keyset': [
    'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  ],
};

export const meta: IMetaData = {
  creationTime: 0,
  ttl: 0,
  gasLimit: 0,
  chainId: '0',
  gasPrice: 0,
  sender: '',
};

export const payload: ICommandPayload = {
  networkId: null,
  payload: {
    exec: {
      data: envData,
      code: pactCode,
    },
  },
  signers: [
    {
      pubKey:
        'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    },
  ],
  meta: {
    creationTime: 0,
    ttl: 0,
    gasLimit: 0,
    chainId: '0',
    gasPrice: 0,
    sender: '',
  },
  nonce: JSON.stringify(nonce),
};

export const signature: SignatureWithHash = {
  hash: 'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik',
  pubKey: 'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  sig: 'b2136d0281e457f7aea130be3185f8c573872dbac9360da26cf5e30999bf3206a3358dd551e8b8aaf3d66d21611c9376fb3ef45fed95d892cc7dfa6023c99d0e',
};

export const stringifiedPayload: string =
  '{"networkId":null,"payload":{"exec":{"data":{"accounts-admin-keyset":["ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"]},"code":"(define-keyset \'k (read-keyset \\"accounts-admin-keyset\\"))\\n(module system \'k\\n  (defun get-system-time ()\\n    (time \\"2017-10-31T12:00:00Z\\")))\\n(get-system-time)"}},"signers":[{"pubKey":"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"}],"meta":{"creationTime":0,"ttl":0,"gasLimit":0,"chainId":"0","gasPrice":0,"sender":""},"nonce":"\\"step01\\""}';

export const command: ICommand = {
  hash: 'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik',
  sigs: [
    {
      sig: 'b2136d0281e457f7aea130be3185f8c573872dbac9360da26cf5e30999bf3206a3358dd551e8b8aaf3d66d21611c9376fb3ef45fed95d892cc7dfa6023c99d0e',
    },
  ],
  cmd: '{"networkId":null,"payload":{"exec":{"data":{"accounts-admin-keyset":["ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"]},"code":"(define-keyset \'k (read-keyset \\"accounts-admin-keyset\\"))\\n(module system \'k\\n  (defun get-system-time ()\\n    (time \\"2017-10-31T12:00:00Z\\")))\\n(get-system-time)"}},"signers":[{"pubKey":"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"}],"meta":{"creationTime":0,"ttl":0,"gasLimit":0,"chainId":"0","gasPrice":0,"sender":""},"nonce":"\\"step01\\""}',
};
