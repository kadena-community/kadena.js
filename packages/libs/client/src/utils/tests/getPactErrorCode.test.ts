import { describe, expect, it } from 'vitest';
import { getPactErrorCode } from '../getPactErrorCode';

describe('getPactErrorCode', () => {
  it('returns "ERROR" if input undefined', () => {
    expect(getPactErrorCode(undefined)).toBe('ERROR');
  });

  it('returns "ERROR" if message is falsy undefined', () => {
    expect(getPactErrorCode({ message: '' })).toBe('ERROR');
    expect(getPactErrorCode({ message: undefined })).toBe('ERROR');
  });

  describe('Pact 4 error messages', () => {
    it('returns "RECORD_NOT_FOUND" for "with-read: row not found: ..." ', () => {
      expect(
        getPactErrorCode({ message: 'with-read: row not found: test-inout' }),
      ).toBe('RECORD_NOT_FOUND');
    });

    it('returns "DEFPACT_COMPLETED" for "pact completed" ', () => {
      expect(getPactErrorCode({ message: 'pact completed' })).toBe(
        'DEFPACT_COMPLETED',
      );
    });

    it('returns "CANNOT_RESOLVE_MODULE" for "Cannot resolve" ', () => {
      expect(getPactErrorCode({ message: 'Cannot resolve' })).toBe(
        'CANNOT_RESOLVE_MODULE',
      );
    });

    it('returns "EMPTY_CODE" for "Failed reading: mzero" ', () => {
      expect(getPactErrorCode({ message: 'Failed reading: mzero' })).toBe(
        'EMPTY_CODE',
      );
    });
  });

  describe('Pact 5 error messages', () => {
    it('returns "RECORD_NOT_FOUND" for "No value found in table coin_coin-table for key: test-key" ', () => {
      expect(
        getPactErrorCode({ message: 'with-read: row not found: test-inout' }),
      ).toBe('RECORD_NOT_FOUND');
    });

    it('returns "DEFPACT_COMPLETED" for "defpact execution already completed" ', () => {
      expect(
        getPactErrorCode({ message: 'defpact execution already completed' }),
      ).toBe('DEFPACT_COMPLETED');
    });

    it('returns "CANNOT_RESOLVE_MODULE" for "has no such member" ', () => {
      expect(getPactErrorCode({ message: 'has no such member' })).toBe(
        'CANNOT_RESOLVE_MODULE',
      );
    });
  });
});
