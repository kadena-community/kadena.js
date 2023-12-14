import { assert, describe, expect, it } from 'vitest';
import { mockServiceCalledWith } from '../../services/index.js';
import { isValidEncryptedValue, run } from '../../utils/test.util.js';

describe('create wallet', () => {
  it('Should create a encrypted seed and store it', async () => {
    const { stdout, stderr } = await run([
      'keys',
      'create-wallet',
      '--key-wallet',
      'test',
      '--key-password',
      '12345678',
    ]);
    expect(stdout.join('\n')).toContain('Your wallet was stored at');
    expect(stderr).toHaveLength(0);

    assert(
      mockServiceCalledWith('fs.directoryExists', [
        (x) => String(x).endsWith('/.kadena/wallets/test'),
      ]),
    );
    assert(
      mockServiceCalledWith('fs.writeFile', [
        (x) => String(x).endsWith('/.kadena/wallets/test/test.wallet'),
        isValidEncryptedValue,
      ]),
    );
  });
});
