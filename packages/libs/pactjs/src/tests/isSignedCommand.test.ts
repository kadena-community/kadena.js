import { ICommand, IUnsignedCommand } from '@kadena/types';

import { ensureSignedCommand, isSignedCommand } from '../isSignedCommand';

const sampleSignedCommand: IUnsignedCommand = {
  hash: 'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8',
  sigs: [
    {
      sig: '4b0ecfbb0e8f3cb291b57abd27028ceaa221950affa39f10efbf4a5fe740d32670e94c3d3949a7e5f4f6ea692052ca110f7cb2e9a8ee2c5eff4251ed84bbfa03',
    },
  ],
  cmd: '{"networkId":null,"payload":{"exec":{"data":{"accounts-admin-keyset":["ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"]},"code":"(define-keyset \'k (read-keyset \\"accounts-admin-keyset\\"))\\n(module system \'k\\n  (defun get-system-time ()\\n    (time \\"2017-10-31T12:00:00Z\\")))\\n(get-system-time)"}},"signers":[{"pubKey":"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"}],"meta":{"creationTime":0,"ttl":0,"gasLimit":0,"chainId":"","gasPrice":0,"sender":""},"nonce":"\\"step01\\""}',
};

const sampleUnsignedCommand: IUnsignedCommand = {
  hash: 'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8',
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
      hash: 'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8',
      sigs: [
        {
          sig: '4b0ecfbb0e8f3cb291b57abd27028ceaa221950affa39f10efbf4a5fe740d32670e94c3d3949a7e5f4f6ea692052ca110f7cb2e9a8ee2c5eff4251ed84bbfa03',
        },
      ],
      cmd: '{"networkId":null,"payload":{"exec":{"data":{"accounts-admin-keyset":["ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"]},"code":"(define-keyset \'k (read-keyset \\"accounts-admin-keyset\\"))\\n(module system \'k\\n  (defun get-system-time ()\\n    (time \\"2017-10-31T12:00:00Z\\")))\\n(get-system-time)"}},"signers":[{"pubKey":"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"}],"meta":{"creationTime":0,"ttl":0,"gasLimit":0,"chainId":"","gasPrice":0,"sender":""},"nonce":"\\"step01\\""}',
    };

    expect(expected).toEqual(actual);
    expect(typeof actual).toEqual(typeof expected);
  });
});
