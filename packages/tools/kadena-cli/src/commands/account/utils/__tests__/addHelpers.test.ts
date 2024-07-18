import type { Mock } from 'vitest';
import { describe, expect, it, vi } from 'vitest';
import { getAccountDirectory } from '../accountHelpers.js';
import { getAccountFilePath } from '../addHelpers.js';

vi.mock('../accountHelpers.js', () => ({
  getAccountDirectory: vi.fn().mockReturnValue('test'),
}));

describe('getAccountFilePath', () => {
  it('should return the account file path', () => {
    const fileName = 'test';
    const result = getAccountFilePath(fileName);
    expect(result).toEqual('test/test.yaml');
  });

  it('should throw an error when accountDirectory is null', () => {
    (getAccountDirectory as Mock).mockReturnValue(null);
    const fileName = 'test';
    expect(() => getAccountFilePath(fileName)).toThrowError(
      'Kadena directory not found. use `kadena config init` to create one.',
    );
  });
});
