import { describe, expect, it } from 'vitest';
import { services } from '../../services/index.js';
import { assertCommandError } from '../../utils/command.util.js';
import { defaultTemplates } from '../commands/templates/templates.js';
import { createTransaction } from '../commands/txCreateTransaction.js';
import { testTransactions } from '../commands/txTestSignedTransaction.js';
import { signTransactionFileWithKeyPairAction } from '../utils/txSignWithKeypair.js';

const publicKey =
  '2619fafe33b3128f38a4e4aefe6a5559371b18b6c25ac897aff165ce14b241b3';
const secretKey =
  'c4e33c93182268c5ef79979493c7d834c81e62ceed22f8ea235cc776c3da0a43';
const targetAccount =
  'k:00b34067644479c769b48b4cc9b2c732e48fc9aeb82d06ecd52dc783550de54d';

describe('template to live test', () => {
  // NOTE: this tests uses live testnet04 meaning it is not isolated!!!
  it('creates, signs and tests the transaction', async () => {
    const variables = {
      'account-from': `k:${publicKey}`,
      'account-to': targetAccount,
      'decimal-amount': '0.01',
      'chain-id': '1',
      'pk-from': publicKey,
      'network-id': 'testnet04',
    };

    await services.filesystem.ensureDirectoryExists(process.cwd());
    const transaction = await createTransaction(
      defaultTemplates.transfer,
      variables,
      'transaction-test.json',
    );
    assertCommandError(transaction);

    const signed = await signTransactionFileWithKeyPairAction({
      files: [transaction.data.filePath],
      keyPairs: [{ publicKey, secretKey }],
    });
    assertCommandError(signed);

    // console.dir(JSON.parse(signed.data.commasnds[0].cmd), { depth: Infinity });
    // console.log(signed.data.commands[0]);

    const test = await testTransactions(
      {
        networkHost: 'https://api.testnet.chainweb.com',
        networkId: 'testnet04',
      },
      '1',
      [signed.data.commands[0].path],
      true,
    );
    assertCommandError(test);
    expect(test.data[0].result).toEqual({
      status: 'success',
      data: 'Write succeeded',
    });
  });
});
