import { describe, expect, it } from 'vitest';
import { services } from '../../services/index.js';
import { assertCommandError } from '../../utils/command.util.js';
import { defaultTemplates } from '../commands/templates/templates.js';
import { createTransaction } from '../commands/txCreateTransaction.js';
import { testTransactions } from '../commands/txTestSignedTransaction.js';
import { signTransactionFileWithKeyPairAction } from '../utils/txSignWithKeypair.js';

const publicKey =
  '476867d07bd8cab2e34ea99c9501fe64e3f3ce7cdb2ce3aed53d43d856a36574';
const secretKey =
  'N3ZLU2lpWjhuT3dhbER1L2Z3Y2wwUT09LkFpWkZBUFh3Vk9KMnlGL2cuMWNWU25LamN4NTJ0OFdZMlgwT0NJWXN4K2NNSlNUZ0pIZjVYNUtwTERVWUpRQUtXZ25KU2Z4UU1OWmVJbnBtNytQc3VMN0N5aitOWXNNVFlsS3R2cS9RZ1RheDRwM20yT25ObzMrRDdLTkNkOCtnaDd2Vjl3T1dyYnVhNjlkQ1lER1RKNlhiU1BWcFgxK25RU0hoY0JLbVVNRXpNay9JcDdKb1Y2N3JtMzZkYzVEcTEyU05QZ2hsWDhOOTJPOTU3LlIyaG4wSHZZeXJMalRxbWNsUUgrWk9QenpuemJMT091MVQxRDJGYWpaWFE9';
const targetAccount =
  'k:00b34067644479c769b48b4cc9b2c732e48fc9aeb82d06ecd52dc783550de54d';

describe('template to legacy live test', () => {
  // NOTE: this tests uses live testnet04 meaning it is not isolated!!!
  it.skip('creates, signs and tests the transaction', async () => {
    const variables = {
      'account:from': `k:${publicKey}`,
      'account:to': targetAccount,
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
      legacy: true,
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
