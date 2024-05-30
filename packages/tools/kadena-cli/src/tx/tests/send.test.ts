import { describe, expect, it } from 'vitest';
import { assertCommandError } from '../../utils/command.util.js';
import { mockPrompts, runCommand } from '../../utils/test.util.js';
import { defaultTemplates } from '../commands/templates/templates.js';
import { createAndWriteTransaction } from '../commands/txCreateTransaction.js';
import { signTransactionFileWithKeyPairAction } from '../utils/txSignWithKeypair.js';

function getFileName(filePath: string): string | undefined {
  return filePath.split('/').pop();
}

function extractData(jsonString: string): Array<{
  command: string;
  fileName: string | undefined;
  filePath: string | undefined;
}> {
  try {
    const jsonObject = JSON.parse(jsonString);
    const commands = jsonObject.data.commands;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return commands.map((commandObj: any) => {
      const command = commandObj.command;
      const filePath = commandObj.path;
      const fileName = getFileName(filePath);
      return { command, fileName, filePath };
    });
  } catch (error) {
    throw new Error('Invalid JSON string or structure');
  }
}

describe('tx send', () => {
  it('Prompts relevant values and sends transaction to chain', async () => {
    const publicKey =
      '2619fafe33b3128f38a4e4aefe6a5559371b18b6c25ac897aff165ce14b241b3';
    const secretKey =
      'c4e33c93182268c5ef79979493c7d834c81e62ceed22f8ea235cc776c3da0a43';
    const targetAccount =
      'k:00b34067644479c769b48b4cc9b2c732e48fc9aeb82d06ecd52dc783550de54d';

    await runCommand(['config', 'init']);

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
        'Select network': 'testnet',
      },
      checkbox: {
        'Select a transaction file': [0],
      },
    });

    const { stderr } = await runCommand(['tx', 'send']);
    expect(stderr.includes('submitted with request key')).toEqual(true);
  });

  it('Sends transaction to chain and polls for result', async () => {
    const publicKey =
      '2619fafe33b3128f38a4e4aefe6a5559371b18b6c25ac897aff165ce14b241b3';
    const secretKey =
      'c4e33c93182268c5ef79979493c7d834c81e62ceed22f8ea235cc776c3da0a43';
    const targetAccount =
      'k:00b34067644479c769b48b4cc9b2c732e48fc9aeb82d06ecd52dc783550de54d';

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

  it('Sends transaction from with fileName as argument', async () => {
    const publicKey =
      '2619fafe33b3128f38a4e4aefe6a5559371b18b6c25ac897aff165ce14b241b3';
    const secretKey =
      'c4e33c93182268c5ef79979493c7d834c81e62ceed22f8ea235cc776c3da0a43';
    const targetAccount =
      'k:00b34067644479c769b48b4cc9b2c732e48fc9aeb82d06ecd52dc783550de54d';

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
    const result = await signTransactionFileWithKeyPairAction({
      files: [transaction.data.filePath],
      keyPairs: [{ publicKey, secretKey }],
    });

    const data = extractData(JSON.stringify(result));

    const { stderr } = await runCommand(
      `tx send --tx-signed-transaction-files=${data[0].fileName}`,
    );
    expect(stderr.includes('submitted with request key')).toEqual(true);
  });

  it('Sends transaction from stdin', async () => {
    const publicKey =
      '2619fafe33b3128f38a4e4aefe6a5559371b18b6c25ac897aff165ce14b241b3';
    const secretKey =
      'c4e33c93182268c5ef79979493c7d834c81e62ceed22f8ea235cc776c3da0a43';
    const targetAccount =
      'k:00b34067644479c769b48b4cc9b2c732e48fc9aeb82d06ecd52dc783550de54d';

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
    const result = await signTransactionFileWithKeyPairAction({
      files: [transaction.data.filePath],
      keyPairs: [{ publicKey, secretKey }],
    });

    const data = extractData(JSON.stringify(result));

    const { stderr } = await runCommand(['tx', 'send'], {
      stdin: JSON.stringify(data[0].command),
    });

    expect(stderr.includes('submitted with request key')).toEqual(true);
  });
});
