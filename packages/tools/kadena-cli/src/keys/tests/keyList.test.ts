import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { WORKING_DIRECTORY } from '../../constants/config.js';
import { runCommand, runCommandJson } from '../../utils/test.util.js';

describe('Key list', () => {
  it('Should list created keys', async () => {
    await runCommand('key generate -a test -n 1');
    await runCommand('key generate --legacy -a foobar -n 1');
    const { stdout } = await runCommand('key list');
    expect(stdout).toContain('test.yaml');
    expect(stdout).toContain('foobar.yaml');

    const output = await runCommandJson('key list');
    expect(output).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          alias: 'foobar.yaml',
          filepath: path.join(WORKING_DIRECTORY, 'foobar.yaml'),
          legacy: true,
        }),
        expect.objectContaining({
          alias: 'test.yaml',
          filepath: path.join(WORKING_DIRECTORY, 'test.yaml'),
          legacy: false,
        }),
      ]),
    );
  });
});
