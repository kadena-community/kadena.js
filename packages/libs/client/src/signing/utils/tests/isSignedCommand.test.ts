import { describe, expect, it } from 'vitest';
import { isSignedTransaction } from '../isSignedTransaction';

describe('isSignedCommand', () => {
  it('returns true if command is signed', () => {
    const command = {
      cmd: 'cmd',
      hash: 'hash',
      sigs: [{ sig: 'sig' }],
    };
    expect(isSignedTransaction(command)).toBe(true);
  });

  it('returns false if command is not signed', () => {
    const command = {
      cmd: 'cmd',
      hash: 'hash',
      sigs: [undefined],
    };
    expect(isSignedTransaction(command)).toBe(false);
  });
});
