import { describe, expect, it } from 'vitest';
import { addSigner } from '../addSigner';

describe('addSigner', () => {
  it('returns a signer object', () => {
    expect(addSigner('bob_public_key')()).toEqual({
      signers: [
        {
          pubKey: 'bob_public_key',
          scheme: 'ED25519',
        },
      ],
    });
  });

  it('adds capability if presented', () => {
    expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      addSigner<any>('bob_public_key', (withCapability) => [
        withCapability('coin.GAS'),
      ])(),
    ).toEqual({
      signers: [
        {
          pubKey: 'bob_public_key',
          scheme: 'ED25519',
          clist: [{ args: [], name: 'coin.GAS' }],
        },
      ],
    });
  });

  it('accept signer object as a first argument', () => {
    expect(addSigner({ pubKey: 'test', scheme: 'ED25519' })()).toEqual({
      signers: [
        {
          pubKey: 'test',
          scheme: 'ED25519',
        },
      ],
    });
  });

  it('returns signers with address if its presented', () => {
    const signer = addSigner({
      pubKey: 'key',
      address: 'address',
    })();
    expect(signer).toEqual({
      signers: [{ pubKey: 'key', address: 'address', scheme: 'ED25519' }],
    });
  });
});
