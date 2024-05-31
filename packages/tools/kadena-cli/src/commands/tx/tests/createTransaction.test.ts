import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { mockPrompts, runCommand } from '../../../utils/test.util.js';
import { ensureNetworksConfiguration } from '../../networks/utils/networkHelpers.js';

describe('tx add', () => {
  it('Prompts values and writes the transaction file', async () => {
    const root = path.join(__dirname, '../../../');
    const kadenaDir = path.join(root, '.kadena');
    await ensureNetworksConfiguration(kadenaDir);

    mockPrompts({
      input: {
        'File path of data to use for template': '',
        'Manual entry for account for template value account:from': 'k:123',
        'Manual entry for account for template value account:to': 'k:456',
        'Template value decimal:amount': '0.01',
        'Template value chain-id': '0',
        'Manual entry for public key for template value key:from': '123',
        'Where do you want to save the output': '',
      },
      select: {
        'Which template do you want to use': 'transfer.ktpl',
        'Select network id for template value networkId': 'testnet',
      },
    });

    const { stderr } = await runCommand(['tx', 'add']);
    expect(stderr.includes('transaction saved to')).toEqual(true);
  });
});
