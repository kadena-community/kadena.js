import { describe, expect, it } from 'vitest';
import { WORKING_DIRECTORY } from '../../constants/config.js';
import { services } from '../../services/index.js';

import { assertCommandError } from '../../utils/command.util.js';
import { mockPrompts, runCommand } from '../../utils/test.util.js';
import { defaultTemplates } from '../commands/templates/templates.js';
import { createTransaction } from '../commands/txCreateTransaction.js';
import { signTransactionFileWithKeyPairAction } from '../utils/txSignWithKeypair.js';

// const cleanupTestEnvironment = async (): Promise<void> => {
//   console.log('cleanupTestEnvironment');
// };

describe('tx send', () => {
  // it('Prompts relevant values and sends transaction to chain', async () => {
  //   const publicKey =
  //     '2619fafe33b3128f38a4e4aefe6a5559371b18b6c25ac897aff165ce14b241b3';
  //   const secretKey =
  //     'c4e33c93182268c5ef79979493c7d834c81e62ceed22f8ea235cc776c3da0a43';
  //   const targetAccount =
  //     'k:00b34067644479c769b48b4cc9b2c732e48fc9aeb82d06ecd52dc783550de54d';

  //   await services.filesystem.ensureDirectoryExists(WORKING_DIRECTORY);
  //   await runCommand(['config', 'init']);

  //   const transaction = await createTransaction(
  //     defaultTemplates.transfer,
  //     {
  //       'account:from': `k:${publicKey}`,
  //       'account:to': targetAccount,
  //       'decimal:amount': '0.01',
  //       'chain-id': '1',
  //       'key:from': publicKey,
  //       'network:networkId': 'testnet04',
  //     },
  //     null,
  //   );

  //   assertCommandError(transaction);
  //   await signTransactionFileWithKeyPairAction({
  //     files: [transaction.data.filePath],
  //     keyPairs: [{ publicKey, secretKey }],
  //   });

  //   mockPrompts({
  //     input: {
  //       'Enter ChainId': '1',
  //     },
  //     select: {
  //       'Select network': 'testnet',
  //     },
  //     checkbox: {
  //       'Select a transaction file': [0],
  //     },
  //   });

  //   const { stderr } = await runCommand(['tx', 'send']);
  //   expect(stderr.includes('submitted with request key')).toEqual(true);
  // });

  it('Sends transaction to chain and polls for result', async () => {
    const publicKey =
      '2619fafe33b3128f38a4e4aefe6a5559371b18b6c25ac897aff165ce14b241b3';
    const secretKey =
      'c4e33c93182268c5ef79979493c7d834c81e62ceed22f8ea235cc776c3da0a43';
    const targetAccount =
      'k:00b34067644479c769b48b4cc9b2c732e48fc9aeb82d06ecd52dc783550de54d';

    await services.filesystem.ensureDirectoryExists(WORKING_DIRECTORY);

    const transaction = await createTransaction(
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
        'Select network': 'testnet',
      },
      checkbox: {
        'Select a transaction file': [0],
      },
    });

    const { stderr } = await runCommand(['tx', 'send', '--poll']);
    expect(
      stderr.includes('Polling success for requestKey: requestKey-1'),
    ).toEqual(true);
  });

  // it('Sends transaction fails for transaction having invalid data', async () => {
  //   const { publicKey, secretKey, targetAccount } =
  //     await setupTestEnvironment();
  //   const transaction = await createTransaction(
  //     defaultTemplates.transfer,
  //     {
  //       'account:from': `k:${publicKey}`,
  //       'account:to': targetAccount,
  //       'decimal:amount': '1',
  //       'chain-id': '21',
  //       'key:from': publicKey,
  //       'network:networkId': 'testnet04',
  //     },
  //     null,
  //   );

  //   assertCommandError(transaction);

  //   await signTransactionFileWithKeyPairAction({
  //     files: [transaction.data.filePath],
  //     keyPairs: [{ publicKey, secretKey }],
  //   });

  //   mockPrompts({
  //     input: {
  //       'Enter ChainId': '1',
  //     },
  //     select: {
  //       'Select network': 'testnet',
  //     },
  //     checkbox: {
  //       'Select a transaction file': [0],
  //     },
  //   });

  //   const { stderr } = await runCommand(['tx', 'send', '--poll']);

  //   expect(stderr.includes('Error in processing transaction')).toEqual(true);
  // });

  it('Sends transaction fails for not beeing signed', async () => {
    await services.filesystem.ensureDirectoryExists(WORKING_DIRECTORY);

    const transaction = await createTransaction(
      defaultTemplates.transfer,
      {
        'account:from': `from`,
        'account:to': 'to',
        'decimal:amount': '1.0',
        'chain-id': '0',
        'key:from': 'k:from',
        'network:networkId': 'testnet04',
      },
      null,
    );

    assertCommandError(transaction);

    await signTransactionFileWithKeyPairAction({
      files: [transaction.data.filePath],
      keyPairs: [{ publicKey: 'from', secretKey: 'secret' }],
    });

    mockPrompts({
      input: {
        'Enter ChainId': '1',
      },
      select: {
        'Select network': 'testnet',
      },
      checkbox: {
        'Select a transaction file': [0],
      },
    });

    const { stderr } = await runCommand('tx send');

    expect(stderr.includes('No signed transactions found')).toEqual(true);
  });
});
