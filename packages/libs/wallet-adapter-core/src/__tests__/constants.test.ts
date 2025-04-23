import { describe, expect, it } from 'vitest';
import { ERRORS } from '../utils/constants';

describe('ERRORS.TRANSACTION_HASH_MISMATCH', () => {
  it('returns a correctly formatted message given two hashes', () => {
    const expectedHash = 'abc123';
    const walletHash = 'def456';
    const message = ERRORS.TRANSACTION_HASH_MISMATCH(expectedHash, walletHash);
    expect(message).toBe(
      `Hash of the transaction signed by the wallet does not match. Our hash: ${expectedHash}, wallet hash: ${walletHash}`,
    );
  });
});
