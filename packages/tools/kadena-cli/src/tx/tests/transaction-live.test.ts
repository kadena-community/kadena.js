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
const targetKey =
  '478f05d5f77fd328a3582c1a644117aaedb8ad221f36c14990b0ef773feea417';
const targetSecretKey =
  '9f1ceeca68674dffe62eddcc263270ab87f3c30beb54c2bdc2589e3622923963';

describe('template to live test', () => {
  // skipped because usage of live chainweb-api (only used for manual testing)
  it.skip('creates, signs and tests the transfer transaction', async () => {
    const variables = {
      'account:from': `k:${publicKey}`,
      'account:to': `k:${targetKey}`,
      'decimal:amount': '0.01',
      'chain-id': '1',
      'key:from': publicKey,
      'network:networkId': 'testnet04',
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

  // skipped because usage of live chainweb-api (only used for manual testing)
  it.skip('creates, signs and tests the safe-transfer transaction', async () => {
    const variables = {
      'account:from': `k:${publicKey}`,
      'account:to': `k:${targetKey}`,
      'decimal:amount': '0.01',
      'chain-id': '0',
      'key:from': publicKey,
      'key:to': targetKey,
      'network:networkId': 'testnet04',
    };

    await services.filesystem.ensureDirectoryExists(process.cwd());
    const transaction = await createTransaction(
      defaultTemplates['safe-transfer'],
      variables,
      'transaction-test.json',
    );
    assertCommandError(transaction);

    const signed = await signTransactionFileWithKeyPairAction({
      files: [transaction.data.filePath],
      keyPairs: [
        { publicKey, secretKey },
        { publicKey: targetKey, secretKey: targetSecretKey },
      ],
    });
    assertCommandError(signed);

    const test = await testTransactions(
      {
        networkHost: 'https://api.testnet.chainweb.com',
        networkId: 'testnet04',
      },
      '0',
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
