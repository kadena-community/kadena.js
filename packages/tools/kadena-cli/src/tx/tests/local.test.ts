import { beforeEach, describe, expect, it, vi } from 'vitest';
import { assertCommandError } from '../../utils/command.util.js';
import { mockPrompts, runCommand } from '../../utils/test.util.js';
import { defaultTemplates } from '../commands/templates/templates.js';
import { createAndWriteTransaction } from '../commands/txCreateTransaction.js';
import { signTransactionFileWithKeyPairAction } from '../utils/txSignWithKeypair.js';

describe('tx local', () => {
  // Mock msw endpoint,

  const publicKey =
    '2619fafe33b3128f38a4e4aefe6a5559371b18b6c25ac897aff165ce14b241b3';
  const secretKey =
    'c4e33c93182268c5ef79979493c7d834c81e62ceed22f8ea235cc776c3da0a43';
  const targetAccount =
    'k:00b34067644479c769b48b4cc9b2c732e48fc9aeb82d06ecd52dc783550de54d';

  beforeEach(async () => {
    vi.clearAllMocks();
  });

  // todo
  it.skip('Submits a valid transaction and receives success response', async () => {
    const transaction = await createAndWriteTransaction(
      defaultTemplates.transfer,
      {
        'account:from': `k:${publicKey}`,
        'account:to': targetAccount,
        'decimal:amount': '0.01',
        'chain-id': '1',
        'key:from': publicKey,
        'network:networkId': 'testnet04',
      },
      null,
    );

    assertCommandError(transaction);

    await signTransactionFileWithKeyPairAction({
      files: [transaction.data.filePath],
      keyPairs: [{ publicKey, secretKey }],
    });

    mockPrompts({
      input: {
        'Enter ChainId': '1',
      },
      select: {
        'Select network': 'testnet04',
      },
    });

    const { stdout } = await runCommand(`tx local '(+ 1 1)'`);

    expect(stdout.includes('Local transaction on network')).toBe(true);
  });
});
