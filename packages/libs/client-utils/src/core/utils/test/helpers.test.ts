import { inspect, safeSign, validateSign } from '../helpers';

describe('inspect', () => {
  it('returns the value passed in', () => {
    expect(inspect('tag')(1)).toBe(1);
  });
});

describe('validateSign', () => {
  it('check if hash of the tx is not changed ', () => {
    const unsignedTx = {
      cmd: 'cmd',
      hash: 'hash',
      sigs: [undefined],
    };
    const signedTx = {
      cmd: 'cmd',
      hash: 'hash',
      sigs: [{ sig: 'sig' }],
    };
    expect(validateSign(unsignedTx, signedTx)).toStrictEqual(signedTx);
  });
});

describe('safeSign', () => {
  it('add signature to the tx by using sign function', async () => {
    const signedTx = {
      cmd: 'cmd',
      hash: 'hash',
      sigs: [{ sig: 'sig' }],
    };
    const sign = vitest.fn().mockResolvedValue(signedTx);
    const signFn = safeSign(sign);

    const result = await signFn({
      cmd: 'cmd',
      hash: 'hash',
      sigs: [undefined],
    });

    expect(result).toStrictEqual(signedTx);
  });
});
