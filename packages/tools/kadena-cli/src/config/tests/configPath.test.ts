import { describe, expect, it } from 'vitest';
import { CWD_KADENA_DIR, HOME_KADENA_DIR } from '../../constants/config.js';
import { runCommand, runCommandJson } from '../../utils/test.util.js';

describe('config path', () => {
  it('should show path used', async () => {
    const { stdout } = await runCommand('config path');
    expect(stdout).toEqual(CWD_KADENA_DIR);
  });

  it('should switch to home dir if it exists', async () => {
    await runCommandJson('config init -g --quiet -c=false');
    const output = await runCommandJson('config path');
    expect(output.directory).toEqual(HOME_KADENA_DIR);
  });
});
