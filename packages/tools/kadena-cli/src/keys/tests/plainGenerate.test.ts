import path from 'path';
import { describe, expect, it } from 'vitest';
import { services } from '../../services/index.js';
import { runCommand } from '../../utils/test.util.js';

const root = path.join(__dirname, '../../../');

describe('create wallet', () => {
  it('Should create a encrypted seed and store it', async () => {
    const result = await runCommand('key generate -a test -n 1'.split(' '));
    const lines = result.split('\n');

    expect(lines.at(-1)).toEqual('.kadena/keys/test.key');

    const filePath = path.join(root, '.kadena/keys/test.key');
    const keyFile = await services.filesystem.readFile(filePath);

    expect(keyFile).toBeTruthy();
    expect(keyFile).toContain('publicKey: ');
    expect(keyFile).toContain('secretKey: ');
  });
});
