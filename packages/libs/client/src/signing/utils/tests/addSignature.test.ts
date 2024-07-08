import { describe, expect, it } from 'vitest';
import type { IPactCommand } from '../../../interfaces/IPactCommand';
import { addSignatures } from '../addSignatures';

describe('addSignature', () => {
  it('returns a new transaction object by adding the input signatures to the sigs array', () => {
    const command: Partial<IPactCommand> = {
      payload: { exec: { code: 'some-pact-code', data: {} } },
      signers: [
        {
          pubKey: 'first_public_key',
        },
        {
          pubKey: 'second_public_key',
        },
      ],
    };
    const originalTr = {
      cmd: JSON.stringify(command),
      hash: 'test-hash',
      sigs: [undefined, undefined],
    };

    const withFirstSig = addSignatures(originalTr, {
      pubKey: 'first_public_key',
      sig: 'first-sig',
    });

    expect(withFirstSig).not.toBe(originalTr);

    expect(withFirstSig).toStrictEqual({
      cmd: JSON.stringify(command),
      hash: 'test-hash',
      sigs: [
        { sig: 'first-sig', pubKey: 'first_public_key' },
        { pubKey: 'second_public_key' },
      ],
    });

    const withAllSigs = addSignatures(withFirstSig, {
      pubKey: 'second_public_key',
      sig: 'second-sig',
    });

    expect(withAllSigs).toStrictEqual({
      cmd: JSON.stringify(command),
      hash: 'test-hash',
      sigs: [
        { sig: 'first-sig', pubKey: 'first_public_key' },
        { sig: 'second-sig', pubKey: 'second_public_key' },
      ],
    });
  });

  it('returns a new transaction object by adding the input signatures without public key to the sigs array', () => {
    const command: Partial<IPactCommand> = {
      payload: { exec: { code: 'some-pact-code', data: {} } },
      signers: [
        {
          pubKey: 'first_public_key',
        },
        {
          pubKey: 'second_public_key',
        },
      ],
    };
    const originalTr = {
      cmd: JSON.stringify(command),
      hash: 'test-hash',
      sigs: [undefined, undefined],
    };

    const withAllSigs = addSignatures(
      originalTr,
      {
        sig: 'first-sig',
      },
      {
        sig: 'second-sig',
      },
    );

    expect(withAllSigs).toStrictEqual({
      cmd: JSON.stringify(command),
      hash: 'test-hash',
      sigs: [
        { sig: 'first-sig', pubKey: 'first_public_key' },
        { sig: 'second-sig', pubKey: 'second_public_key' },
      ],
    });
  });
  it('throws an exception if signatures are not matched', () => {
    const command: Partial<IPactCommand> = {
      payload: { exec: { code: 'some-pact-code', data: {} } },
      signers: [
        {
          pubKey: 'first_public_key',
        },
        {
          pubKey: 'second_public_key',
        },
      ],
    };
    const originalTr = {
      cmd: JSON.stringify(command),
      hash: 'test-hash',
      sigs: [undefined, undefined],
    };
    expect(() =>
      addSignatures(originalTr, { sig: '' }, { sig: '' }, { sig: '' }),
    ).toThrowError();
  });
});
