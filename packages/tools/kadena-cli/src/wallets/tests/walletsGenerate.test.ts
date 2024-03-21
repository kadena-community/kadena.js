import path from 'path';
import { assert, describe, expect, it } from 'vitest';
import { services } from '../../services/index.js';
import { isValidEncryptedValue } from '../../utils/test.util.js';
import { generateWallet } from '../commands/walletsWalletGenerate.js';

const root = path.join(__dirname, '../../../');

describe('create wallet', () => {
  it('Should create a encrypted seed and store it', async () => {
    const result = await generateWallet('test', '12345678', false);

    assert(result.status === 'success');

    const filePath = path.join(root, '.kadena/wallets/test/test.wallet');
    expect(result.data.mnemonic.split(' ')).toHaveLength(12);
    expect(result.data.path).toEqual(filePath);

    const fs = services.filesystem;
    const walletFile = await fs.readFile(filePath);

    expect(walletFile).toBeTruthy();
    expect(isValidEncryptedValue(walletFile)).toBe(true);
  });
});
