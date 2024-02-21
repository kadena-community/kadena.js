import { describe, expect, it } from 'vitest';
import { mockPrompts, runCommand } from '../../utils/test.util.js';

describe('prompt test', () => {
  it('test', async () => {
    mockPrompts({
      input: {
        'account-from': 'k:123',
        'account-to': 'k:123',
        'decimal-amount': '5.0',
        'chain-id': '1',
      },
      select: {
        'Which template do you want to use': 'transfer.yaml',
      },
    });

    const logs = await runCommand(['tx', 'create-transaction']);
    expect(logs.includes('transaction saved to')).toEqual(true);
  });
});
