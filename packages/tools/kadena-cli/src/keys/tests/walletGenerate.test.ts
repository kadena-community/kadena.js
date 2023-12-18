import path from 'path';
import { describe, expect, it } from 'vitest';
import { services } from '../../services/index.js';
import { isValidEncryptedValue, run } from '../../utils/test.util.js';

const root = path.join(__dirname, '../../../');

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

    const fs = services.filesystem;
    const walletFile = await fs.readFile(
      path.join(root, '.kadena/wallets/test/test.wallet'),
    );

    expect(walletFile).toBeTruthy();
    expect(isValidEncryptedValue(walletFile)).toBe(true);
  });
});
