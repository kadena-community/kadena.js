import type { EncryptedString } from '@kadena/hd-wallet';
import { assert, describe, expect, it } from 'vitest';
import { decrypt } from '../commands/walletsDecrypt.js';

describe('decrypt command', () => {
  it('should decrypt a message correctly', async () => {
    const message =
      'R0hiSzI4aEZxa2ZJSnI1UGZxQTkwZz09LmxidlJXZzNsbndsQmIrVEkudkZ0bEduYVp6MzJuVTlvdWlZRUpFWG9DbmVQTWdxNi9vdWd0VnhWZFpKOHJMZ2t3eGZJUlNCU2txNDhDZ3pvKzgvbHdPWGtYZkVLUVAxK1pVOElCVERKMXp4dnlzSVkrN2FGWGduMHQ0MjQ9';
    const password = '12345678';

    const output = await decrypt(password, message as EncryptedString);

    assert(output.success);

    expect(output.data.value).toEqual(
      '786aeb505f3dd734d2acd25846816dc0d5f975474a391f4190400c4f4ccb57aab50fd5612de8edaf35c3a01b0a9c564c2e216cfb512591639c5e901d55f2363f',
    );
  });
});
