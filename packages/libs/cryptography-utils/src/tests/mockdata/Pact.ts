import { type IUnsignedCommand } from '@kadena/types';

/**
 * @alpha
 */
export const pactTestCommand: {
  networkId: undefined | unknown;
  payload: {
    exec: { data: { 'accounts-admin-keyset': string[] }; code: string };
  };
  signers: { pubKey: string }[];
  meta: {
    creationTime: number;
    ttl: number;
    gasLimit: number;
    chainId: string;
    gasPrice: number;
    sender: string;
  };
  nonce: string;
} = {
  networkId: null,
  payload: {
    exec: {
      data: {
        'accounts-admin-keyset': [
          'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
        ],
      },
      code: '(define-keyset \'k (read-keyset "accounts-admin-keyset"))\n(module system \'k\n  (defun get-system-time ()\n    (time "2017-10-31T12:00:00Z")))\n(get-system-time)',
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
  nonce: JSON.stringify('step01'),
};

/**
 * @alpha
 */
export const pactTestCommand1: IUnsignedCommand = {
  hash: 'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik',
  sigs: [
    {
      sig: '26d765e3b812d59d80ffbd034d4fc4a1a24f8d0c3929586575617089e5098d967955d348608b515ae9ff7871b46726ffc71252d53b9e562d5bcf3bfe66292906',
    },
  ],
  cmd: '{"networkId":null,"payload":{"exec":{"data":{"accounts-admin-keyset":["ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"]},"code":"(define-keyset \'k (read-keyset \\"accounts-admin-keyset\\"))\\n(module system \'k\\n  (defun get-system-time ()\\n    (time \\"2017-10-31T12:00:00Z\\")))\\n(get-system-time)"}},"signers":[{"pubKey":"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"}],"meta":{"creationTime":0,"ttl":0,"gasLimit":0,"chainId":"","gasPrice":0,"sender":""},"nonce":"\\"step01\\""}',
};

/**
 * @alpha
 */
export const pactTestCommand2: IUnsignedCommand = {
  hash: 'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik',
  sigs: [undefined],
  cmd: '{"networkId":null,"payload":{"exec":{"data":{"accounts-admin-keyset":["ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"]},"code":"(define-keyset \'k (read-keyset \\"accounts-admin-keyset\\"))\\n(module system \'k\\n  (defun get-system-time ()\\n    (time \\"2017-10-31T12:00:00Z\\")))\\n(get-system-time)"}},"signers":[{"pubKey":"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"}],"meta":{"creationTime":0,"ttl":0,"gasLimit":0,"chainId":"","gasPrice":0,"sender":""},"nonce":"\\"step01\\""}',
};
