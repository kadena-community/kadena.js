import { beforeEach, describe, expect, it } from 'vitest';
import { useHandler } from '../../../mocks/server.js';
import { assertCommandError } from '../../../utils/command.util.js';
import { createAndWriteTransaction } from '../commands/txCreateTransaction.js';
import { testTransactionAction } from '../commands/txTestSignedTransaction.js';
import { signTransactionFileWithKeyPairAction } from '../utils/txSignWithKeypair.js';

const publicKey =
  '2619fafe33b3128f38a4e4aefe6a5559371b18b6c25ac897aff165ce14b241b3';
const secretKey =
  'c4e33c93182268c5ef79979493c7d834c81e62ceed22f8ea235cc776c3da0a43';

const template = `
code: |-
  "Hello Verifiers"
meta:
  chainId: "0"
  sender: "sender00"
  gasLimit: 2300
  gasPrice: 0.000001
  ttl: 600
networkId: development
signers:
  - public: "${publicKey}"
    caps:
      - name: "coin.GAS"
        args: []
type: exec
verifiers:
    - name: "allow"
      proof: |
        { "name": "verifiers.HELLO", "args": ["in", "out"] }
      clist:
        - name: "verifiers.HELLO"
          args: ["in", "out"]
`;

describe('tx add', () => {
  beforeEach(() => {
    useHandler({
      response: {
        result: {
          status: 'success',
          data: 'Write succeeded',
        },
      },
    });
  });
  it('Prompts values and writes the transaction file', async () => {
    const transaction = await createAndWriteTransaction(template, {}, null);
    assertCommandError(transaction);

    const cmd = JSON.parse(transaction.data.transaction.cmd);

    expect(cmd.verifiers[0]).toEqual({
      name: 'allow',
      proof: '{ "name": "verifiers.HELLO", "args": ["in", "out"] }\n',
      clist: [{ name: 'verifiers.HELLO', args: ['in', 'out'] }],
    });

    const signed = await signTransactionFileWithKeyPairAction({
      files: [transaction.data.filePath],
      keyPairs: [{ publicKey, secretKey }],
    });
    assertCommandError(signed);

    // TODO: not hardcode network details here
    const test = await testTransactionAction({
      transactionsWithDetails: [
        {
          command: signed.data.commands[0].command,
          details: {
            chainId: '1',
            network: 'testnet',
            networkId: 'testnet04',
            networkHost: 'https://api.testnet.chainweb.com',
            networkExplorerUrl: ' https://explorer.chainweb.com/testnet/tx/',
          },
        },
      ],
    });
    assertCommandError(test);
    expect(test.data.transactions[0].response?.result).toEqual({
      status: 'success',
      data: 'Write succeeded',
    });
  });
});
