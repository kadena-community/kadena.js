import { describe, expect, it } from 'vitest';
import { mockPrompts, runCommand } from '../../utils/test.util.js';

describe('tx add', () => {
  it.skip('Prompts values and writes the transaction file', async () => {
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

    const { stderr } = await runCommand(['tx', 'add']);
    expect(stderr.includes('transaction saved to')).toEqual(true);
  });
});
