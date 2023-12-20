import { describe, expect, it } from 'vitest';
import { run } from '../../utils/test.util.js';

describe('decrypt command', () => {
  it('should decrypt a message correctly', async () => {
    const keyMessage =
      'STBjVU02cmFVV1UvNkUvei9wOGhOUT09Lm00RS8yWGlHeisraUZNMkEuNjhzMGk0UlBKcFRRc1ptOVhCMlFxQT09Lmk0NjEwbDVUYWd0TmVMMWhNM2xvTHIzNmMyam5CTDBDUUFyNXZjbldxWFJhOXRoa25MSnFUc3VmWEdoWnVNMkVRWFpmbEpYcnh2Y1cwK0p2NXpjeDlRPT0=';
    const password = '12345678';

    const { stdout, stderr } = await run([
      'keys',
      'decrypt',
      '--key-message',
      keyMessage,
      '--security-current-password',
      password,
    ]);

    expect(stderr).toEqual('');
    expect(stdout).toContain(
      '786aeb505f3dd734d2acd25846816dc0d5f975474a391f4190400c4f4ccb57aab50fd5612de8edaf35c3a01b0a9c564c2e216cfb512591639c5e901d55f2363f',
    );
  });
});
