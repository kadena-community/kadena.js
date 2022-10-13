import { parseTemplate } from '../parseTemplate';

import { readFileSync } from 'fs';
import { join } from 'path';

describe('parseTemplate', () => {
  it('parses a simple template `Hello {{name}}`', () => {
    const result = parseTemplate(`Hello {{name}}`);
    const expected = { parts: ['Hello ', ''], holes: ['name'] };
    expect(result).toEqual(expected);
  });

  it('parses a command template', () => {
    const result = parseTemplate(
      `(coin.transfer "{{sender}}", "{{receiver}}", {{amount}})`,
    );
    const expected = {
      parts: ['(coin.transfer "', '", "', '", ', ')'],
      holes: ['sender', 'receiver', 'amount'],
    };
    expect(result).toEqual(expected);
  });

  it('parses a JSON string template', () => {
    const template = readFileSync(
      join(__dirname, './simple-transfer.yaml'),
      'utf8',
    );
    const result = parseTemplate(template);
    const expected = {
      parts: [
        `code: |-
  (coin.transfer \"`,
        `\" \"`,
        `\" `,
        `)
data:
publicMeta:
  chainId: \"`,
        `\"
  sender: `,
        `
  gasLimit: 2500
  gasPrice: 0.00000001
  ttl: 7200
networkId: `,
        `
signers:
  - public: `,
        `
    caps:
      - name: \"coin.TRANSFER\"
        args: [`,
        `, `,
        `, `,
        `]
      - name: \"coin.GAS\"
        args: []
type: exec
docs:
  from-acct: Account that you want to send from
  to-acct: Account that you want to send to
  amount: The amount of KDA that you want to transfer
  chain: The chain that you want to execute the transaction on
  network: The network that you want to use (\"testnet04\", \"mainnet\")
  from-key: The key (without k:) that signs the caps
`,
      ],
      holes: [
        'from-acct',
        'to-acct',
        'amount',
        'chain',
        'from-acct',
        'network',
        'from-key',
        'from-acct',
        'to-acct',
        'amount',
      ],
    };
    expect(result).toEqual(expected);
  });
});
