import { describe, expect, it } from 'vitest';
import { attachSignature } from '../attachSignature';
import { keyPair, signature, stringifiedPayload } from './mockdata/execCommand';

describe('attachSignature', () => {
  it('Takes in stringified cmd and keyPairs, and outputs signatures with hash', () => {
    const actual = attachSignature(stringifiedPayload, [keyPair]);
    const expected = [signature];

    expect(actual).toEqual(expected);
  });

  it('returns without sig when no keys are given', () => {
    const actual = attachSignature(stringifiedPayload, []);
    const expected = [{ hash: signature.hash, sig: undefined }];

    expect(actual).toEqual(expected);
  });

  it('returns without sig when `secretKey` is not given', () => {
    const actual = attachSignature(stringifiedPayload, [
      { publicKey: keyPair.publicKey } as {
        publicKey: string;
        secretKey: string;
      },
    ]);
    const expected = [
      { hash: signature.hash, sig: undefined, publicKey: signature.pubKey },
    ];

    expect(actual).toEqual(expected);
  });
});
