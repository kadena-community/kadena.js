import { describe, expect, it } from 'vitest';
import { assertCommandError } from '../../utils/command.util.js';
import { createTransaction } from '../commands/txCreateTransaction.js';

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
  - public: "368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca"
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
  it('Prompts values and writes the transaction file', async () => {
    const transaction = await createTransaction(template, {}, null);
    assertCommandError(transaction);

    const cmd = JSON.parse(transaction.data.transaction.cmd);

    expect(cmd.verifiers[0]).toEqual({
      name: 'allow',
      proof: '{ "name": "verifiers.HELLO", "args": ["in", "out"] }\n',
      clist: [{ name: 'verifiers.HELLO', args: ['in', 'out'] }],
    });
  });
});
