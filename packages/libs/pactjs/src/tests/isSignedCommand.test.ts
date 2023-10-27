import type { ICommand, IUnsignedCommand } from '@kadena/types';
import { ensureSignedCommand, isSignedCommand } from '../isSignedCommand';

const sampleSignedCommand: IUnsignedCommand = {
  hash: 'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik',
  sigs: [
    {
      sig: '26d765e3b812d59d80ffbd034d4fc4a1a24f8d0c3929586575617089e5098d967955d348608b515ae9ff7871b46726ffc71252d53b9e562d5bcf3bfe66292906',
    },
  ],
  cmd: '{"networkId":null,"payload":{"exec":{"data":{"accounts-admin-keyset":["ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"]},"code":"(define-keyset \'k (read-keyset \\"accounts-admin-keyset\\"))\\n(module system \'k\\n  (defun get-system-time ()\\n    (time \\"2017-10-31T12:00:00Z\\")))\\n(get-system-time)"}},"signers":[{"pubKey":"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"}],"meta":{"creationTime":0,"ttl":0,"gasLimit":0,"chainId":"","gasPrice":0,"sender":""},"nonce":"\\"step01\\""}',
};

const sampleUnsignedCommand: IUnsignedCommand = {
  hash: 'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik',
  sigs: [undefined],
  cmd: '{"networkId":null,"payload":{"exec":{"data":{"accounts-admin-keyset":["ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"]},"code":"(define-keyset \'k (read-keyset \\"accounts-admin-keyset\\"))\\n(module system \'k\\n  (defun get-system-time ()\\n    (time \\"2017-10-31T12:00:00Z\\")))\\n(get-system-time)"}},"signers":[{"pubKey":"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"}],"meta":{"creationTime":0,"ttl":0,"gasLimit":0,"chainId":"","gasPrice":0,"sender":""},"nonce":"\\"step01\\""}',
};

describe('isSignedCommand', () => {
  it('Returns true when command is signed', () => {
    const actual = isSignedCommand(sampleSignedCommand);
    const expected: boolean = true;

    expect(expected).toEqual(actual);
  });

  it('Returns false when command is unsigned', () => {
    const actual = isSignedCommand(sampleUnsignedCommand);
    const expected: boolean = false;

    expect(expected).toEqual(actual);
  });
});

describe('ensureSignedCommand', () => {
  it('throws error when command is unsigned', () => {
    expect(() => ensureSignedCommand(sampleUnsignedCommand)).toThrow();
  });

  it('returns command in `ICommand` type when command is signed', () => {
    const actual: ICommand = ensureSignedCommand(sampleSignedCommand);
    const expected: ICommand = {
      hash: 'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik',
      sigs: [
        {
          sig: '26d765e3b812d59d80ffbd034d4fc4a1a24f8d0c3929586575617089e5098d967955d348608b515ae9ff7871b46726ffc71252d53b9e562d5bcf3bfe66292906',
        },
      ],
      cmd: '{"networkId":null,"payload":{"exec":{"data":{"accounts-admin-keyset":["ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"]},"code":"(define-keyset \'k (read-keyset \\"accounts-admin-keyset\\"))\\n(module system \'k\\n  (defun get-system-time ()\\n    (time \\"2017-10-31T12:00:00Z\\")))\\n(get-system-time)"}},"signers":[{"pubKey":"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"}],"meta":{"creationTime":0,"ttl":0,"gasLimit":0,"chainId":"","gasPrice":0,"sender":""},"nonce":"\\"step01\\""}',
    };

    expect(expected).toEqual(actual);
    expect(typeof actual).toEqual(typeof expected);
  });
});
