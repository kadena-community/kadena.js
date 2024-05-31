import jsYaml from 'js-yaml';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { WORKING_DIRECTORY } from '../../../constants/config.js';
import { services } from '../../../services/index.js';
import { runCommand } from '../../../utils/test.util.js';

describe('Key generate', () => {
  afterEach(async () => {
    await services.filesystem.deleteFile(
      path.join(WORKING_DIRECTORY, 'test.yaml'),
    );
  });

  it('Should create a encrypted seed and store it', async () => {
    const { stderr } = await runCommand('key generate -a test -n 1');
    const lines = stderr.split('\n');
    expect(lines.at(-1)).toEqual('test.yaml');

    const filePath = path.join(WORKING_DIRECTORY, 'test.yaml');
    const keyFile = await services.filesystem.readFile(filePath);

    expect(keyFile).toBeTruthy();
    expect(keyFile).toContain('publicKey: ');
    expect(keyFile).toContain('secretKey: ');
  });

  it('Should create a legacy encrypted seed and store it', async () => {
    const { stderr } = await runCommand('key generate --legacy -a test -n 1');
    const lines = stderr.split('\n');
    expect(lines.at(-1)).toEqual('test.yaml');

    const filePath = path.join(WORKING_DIRECTORY, 'test.yaml');
    const keyFile = await services.filesystem.readFile(filePath);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsed = jsYaml.load(keyFile!) as any;

    expect(keyFile).toBeTruthy();
    expect(parsed.publicKey.length).toEqual(64);
    expect(parsed.legacy).toEqual(true);
    expect(
      Buffer.from(parsed.secretKey, 'base64').toString().split('.').length,
    ).toEqual(4);
  });
});
