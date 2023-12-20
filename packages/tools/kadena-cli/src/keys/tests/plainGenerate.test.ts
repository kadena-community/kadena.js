import path from 'path';
import { describe, expect, it } from 'vitest';
import { services } from '../../services/index.js';
import { generatePlainKeys } from '../commands/keysPlainGenerate.js';

const root = path.join(__dirname, '../../../');

describe('create wallet', () => {
  it('Should create a encrypted seed and store it', async () => {
    const result = await generatePlainKeys('test', 1, false);

    if (!result.success) throw new Error('Should be true');

    expect(result.data.keys[0].publicKey).toBeTruthy();
    expect(result.data.keys[0].secretKey).toBeTruthy();

    const filePath = path.join(root, '.kadena/keys/test.key');
    const fs = services.filesystem;
    const keyFile = await fs.readFile(filePath);

    expect(keyFile).toBeTruthy();
    expect(keyFile).toContain('publicKey: ');
    expect(keyFile).toContain('secretKey: ');
  });
});
