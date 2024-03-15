import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  convertTemplateTxToPactCommand,
  getPartsAndHolesInCtx,
  parseYamlToKdaTx,
  replaceHoles,
  replaceHolesInCtx,
} from '../yaml-converter';

import {
  createPactCommandFromStringTemplate,
  createPactCommandFromTemplate,
} from '../';

describe('yaml-converter', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date('2023-10-26'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getPartsAndHoles', () => {
    it('parses a simple string', () => {
      expect(
        getPartsAndHolesInCtx('./aux-files/simple-test.yaml', __dirname),
      ).deep.eq({
        cwd: __dirname,
        tplPath: './aux-files/simple-test.yaml',
        tplString: [
          [
            'Hello ',
            `!
`,
          ],
          [
            {
              literal: 'name',
            },
          ],
        ],
      });
    });

    it('parses a complex string', () => {
      expect(
        getPartsAndHolesInCtx('./aux-files/complex-test.yaml', __dirname),
      ).deep.eq({
        cwd: __dirname,
        tplPath: './aux-files/complex-test.yaml',
        tplString: [
          [
            'Hello ',
            `! Where is `,
            '',
            `!
`,
          ],
          [
            {
              literal: 'name',
            },
            {
              literal: 'name',
            },
            {
              literal: 'literalName',
            },
          ],
        ],
      });
    });
  });

  describe('replaceHoles', () => {
    it('replaces holes for simple string', () => {
      const result = replaceHoles({
        name: 'Albert',
      })(
        getPartsAndHolesInCtx('./aux-files/simple-test.yaml', __dirname)
          .tplString,
      );
      expect(result).eq(`Hello Albert!
`);
    });

    it('replaces holes for simple string', () => {
      const result = replaceHoles({
        name: 'Albert',
        literalName: 'literalAlbert',
      })(
        getPartsAndHolesInCtx('./aux-files/complex-test.yaml', __dirname)
          .tplString,
      );
      expect(result).eq(`Hello Albert! Where is AlbertliteralAlbert!
`);
    });

    it('throws an error when a hole is not provided', () => {
      expect(() =>
        replaceHoles({
          notName: 'Albert',
        })(
          getPartsAndHolesInCtx('./aux-files/complex-test.yaml', __dirname)
            .tplString,
        ),
      ).to.throw(
        'argument to fill hole for name is missing in Hello {{name}}!',
      );
    });
  });

  describe('parseYamlToKdaTx', () => {
    it('parses a template with `codefile` property with holes', () => {
      const args = {
        thisIsFalse: 'false',
        aNumber: 12,
        literalName: 'My Literal Name',
      };

      const tplTx = parseYamlToKdaTx(args)(
        replaceHolesInCtx(args)(
          getPartsAndHolesInCtx('./aux-files/tx-with-codefile.yaml', __dirname),
        ),
      );

      expect(tplTx).deep.eq({
        code: `(module 12 My Literal Name)
`,
        data: 12,
        something: false,
      });
    });

    it('parses a template without `codefile` property ', () => {
      const args = {
        thisIsFalse: 'false',
        aNumber: 12,
      };

      const tplTx = parseYamlToKdaTx(args)(
        replaceHolesInCtx(args)(
          getPartsAndHolesInCtx(
            './aux-files/tx-without-codefile.yaml',
            __dirname,
          ),
        ),
      );

      expect(tplTx).deep.eq({
        code: `(module 123 Nil)`,
        data: 12,
        something: false,
      });
    });
  });

  describe('convertToKadenaClientTransaction', () => {
    it('converts a kdaToolTx to KadenaClientTx', () => {
      const args = {
        chain: 1,
        'funding-acct':
          'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
        network: 'testnet',
        'gas-station-name': 'my-gas-station',
        amount: 123_000,
        'funding-key':
          '554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
        'owner-key':
          'f90ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
      };

      const res = convertTemplateTxToPactCommand(
        parseYamlToKdaTx(args)(
          replaceHolesInCtx(args)(
            getPartsAndHolesInCtx('./aux-files/real-tx-tpl.yaml', __dirname),
          ),
        ),
      );

      expect(res).toStrictEqual({
        meta: {
          chainId: '1',
          creationTime: 1698278400,
          sender:
            'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
          gasLimit: 2000,
          gasPrice: 1e-8,
          ttl: 7200,
        },
        networkId: 'testnet',
        nonce: '',
        signers: [
          {
            caps: [
              {
                name: 'coin.TRANSFER',
                args: [
                  'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
                  'my-gas-station',
                  123000,
                ],
              },
              {
                name: 'coin.GAS',
                args: [],
              },
            ],
            pubKey:
              '554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
          },
          {
            caps: [
              {
                name: 'coin.ROTATE',
                args: ['my-gas-station'],
              },
            ],
            pubKey:
              'f90ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
          },
        ],
        type: 'exec',
        payload: {
          exec: {
            data: {},
            code: '(let\n    ((mk-guard (lambda (max-gas-price:decimal)\n                (util.guards.guard-or\n                  (keyset-ref-guard "ns-admin-keyset")\n                  (util.guards1.guard-all\n                    [ (create-user-guard (coin.gas-only))\n                      (util.guards1.max-gas-price max-gas-price)\n                      (util.guards1.max-gas-limit 500)\n                    ]))\n               )\n     )\n    )\n\n    (coin.transfer-create\n      "k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94"\n      "my-gas-station"\n      (mk-guard 0.0000000001)\n      123000)\n    (coin.rotate\n      "my-gas-station"\n      (mk-guard 0.00000001))\n  )\n',
          },
        },
      });
    });
  });

  describe('convertYamlToKadenaClientTransaction', () => {
    it('converts a yaml with holes to KadenaClientTx pt1', async () => {
      const args = {
        chain: 1,
        'funding-acct':
          'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
        network: 'testnet',
        'gas-station-name': 'my-gas-station',
        amount: 123_000,
        'funding-key':
          '554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
        'owner-key':
          'f90ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
      };

      const res = await createPactCommandFromTemplate(
        './aux-files/real-tx-tpl.yaml',
        args,
        __dirname,
      );

      expect(res).toStrictEqual({
        meta: {
          chainId: '1',
          creationTime: 1698278400,
          sender:
            'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
          gasLimit: 2000,
          gasPrice: 1e-8,
          ttl: 7200,
        },
        networkId: 'testnet',
        nonce: '',
        signers: [
          {
            caps: [
              {
                name: 'coin.TRANSFER',
                args: [
                  'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
                  'my-gas-station',
                  123000,
                ],
              },
              {
                name: 'coin.GAS',
                args: [],
              },
            ],
            pubKey:
              '554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
          },
          {
            caps: [
              {
                name: 'coin.ROTATE',
                args: ['my-gas-station'],
              },
            ],
            pubKey:
              'f90ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
          },
        ],
        type: 'exec',
        payload: {
          exec: {
            data: {},
            code: '(let\n    ((mk-guard (lambda (max-gas-price:decimal)\n                (util.guards.guard-or\n                  (keyset-ref-guard "ns-admin-keyset")\n                  (util.guards1.guard-all\n                    [ (create-user-guard (coin.gas-only))\n                      (util.guards1.max-gas-price max-gas-price)\n                      (util.guards1.max-gas-limit 500)\n                    ]))\n               )\n     )\n    )\n\n    (coin.transfer-create\n      "k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94"\n      "my-gas-station"\n      (mk-guard 0.0000000001)\n      123000)\n    (coin.rotate\n      "my-gas-station"\n      (mk-guard 0.00000001))\n  )\n',
          },
        },
      });
    });

    it('converts a yaml from string', async () => {
      const result = await createPactCommandFromStringTemplate(
        readFileSync(
          join(__dirname, './aux-files/tx-without-codefile.yaml'),
          'utf8',
        ),
        { aNumber: 1, thisIsFalse: '1' },
      );
      expect(result).toStrictEqual({
        something: 1,
        payload: { exec: { data: 1, code: '(module 123 Nil)' } },
        meta: { chainId: undefined, creationTime: 1698278400 },
        nonce: '',
        signers: [],
        networkId: undefined,
      });
    });

    it('converts a yaml with holes to KadenaClientTx pt2', async () => {
      const args = {
        sender_key:
          'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        marmalade_user_key_1:
          '554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        marmalade_user_key_2:
          'f90ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
        marmalade_namespace: 'test-namespace',
        is_upgrade: 'false',
        network: 'testnet',
        chain: 1,
        'gas-station-name': 'my-gas-station',
        sender: 'my-test-sender',
        nonce: 'real-policy-manager-nonce',
      };

      const res = await createPactCommandFromTemplate(
        './aux-files/real-policy-manager-test.yaml',
        args,
        __dirname,
      );

      expect(res).toStrictEqual({
        nonce: 'real-policy-manager-nonce',
        signers: [
          {
            pubKey:
              'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
          },
          {
            pubKey:
              '554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
          },
          {
            pubKey:
              'f90ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
          },
        ],
        networkId: 'testnet',
        payload: {
          exec: {
            data: {
              ns: 'test-namespace',
              upgrade: false,
            },
            code: '(test-module 123 k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94)',
          },
        },
        meta: {
          chainId: '1',
          creationTime: 1698278400,
          sender: 'my-test-sender',
          gasLimit: 100000,
          gasPrice: 1e-7,
          ttl: 10000,
        },
      });
    });
    it('converts a yaml with no holes to KadenaClientTx', async () => {
      const args = {};
      const res = await createPactCommandFromTemplate(
        './aux-files/real-policy-manager-no-holes-test.yaml',
        args,
        __dirname,
      );

      expect(res).toStrictEqual({
        nonce: 'real-policy-manager-nonce',
        signers: [
          {
            pubKey:
              'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
          },
          {
            pubKey:
              '554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
          },
          {
            pubKey:
              'f90ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
          },
        ],
        networkId: 'testnet',
        payload: {
          exec: {
            data: {
              ns: 'test-namespace',
              upgrade: false,
            },
            code: '(test-module 123 k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94)',
          },
        },
        meta: {
          chainId: '1',
          creationTime: 1698278400,
          sender: 'my-test-sender',
          gasLimit: 100000,
          gasPrice: 1e-7,
          ttl: 10000,
        },
      });
    });
  });
});
