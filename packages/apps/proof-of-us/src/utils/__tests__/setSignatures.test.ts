import { describe, expect, test } from 'vitest';
import { setSignatures } from '../setSignatures';
import { createSigners } from './testutils/createSigners';

describe('utils setSignatures', () => {
  test('should return the correct array of signatures in the command', () => {
    const signees = createSigners({
      count: 8,
      startSignedCount: 0,
      startNotAllowedCount: 3,
      endNotAllowedCount: 5,
    });

    const tx = {
      cmd: JSON.stringify({
        signers: signees.map((v) => ({ pubKey: v.publicKey })),
      }),
      hash: 'test',
      sigs: [],
    };

    const signedTx = setSignatures(tx, signees);

    expect(signedTx.sigs.length).toEqual(5);

    expect(signedTx.sigs).toEqual(
      signees.reduce(
        (acc, val) => {
          if (val.signature) acc.push({ sig: val.signature });

          return acc;
        },
        [] as Record<'sig', string>[],
      ),
    );
  });
});
