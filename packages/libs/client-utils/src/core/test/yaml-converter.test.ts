import { describe, expect, it } from 'vitest';
import {
  convertToKadenaClientTransaction,
  convertYamlToKadenaClientTransaction,
  getPartsAndHolesInCtx,
  parseYamlKdaTx,
  replaceHoles,
  replaceHolesInCtx,
} from '../yaml-converter';

describe('yaml-converter', () => {
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
      const result = replaceHoles(
        getPartsAndHolesInCtx('./aux-files/simple-test.yaml', __dirname)
          .tplString,
        {
          name: 'Albert',
        },
      );
      expect(result).eq(`Hello Albert!
`);
    });

    it('replaces holes for simple string', () => {
      const result = replaceHoles(
        getPartsAndHolesInCtx('./aux-files/complex-test.yaml', __dirname)
          .tplString,
        {
          name: 'Albert',
          literalName: 'literalAlbert',
        },
      );
      expect(result).eq(`Hello Albert! Where is AlbertliteralAlbert!
`);
    });

    it('throws an error when a hole is not provided', () => {
      expect(() =>
        replaceHoles(
          getPartsAndHolesInCtx('./aux-files/complex-test.yaml', __dirname)
            .tplString,
          {
            notName: 'Albert',
          },
        ),
      ).to.throw(
        'argument to fill hole for name is missing in Hello {{name}}!',
      );
    });
  });

  describe('parseYamlKdaTx', () => {
    it('parses a template with `codefile` property with holes', () => {
      const args = {
        thisIsFalse: 'false',
        aNumber: 12,
        literalName: 'My Literal Name',
      };

      const res = parseYamlKdaTx(
        replaceHolesInCtx(
          getPartsAndHolesInCtx('./aux-files/tx-with-codefile.yaml', __dirname),
          args,
        ),
        args,
      );

      expect(res.tplTx).deep.eq({
        code: `(module 12 My Literal Name)
`,
        codeFile: './aux-files/codefile.pact',
        data: 12,
        something: false,
      });
    });

    it('parses a template without `codefile` property ', () => {
      const args = {
        thisIsFalse: 'false',
        aNumber: 12,
      };

      const res = parseYamlKdaTx(
        replaceHolesInCtx(
          getPartsAndHolesInCtx(
            './aux-files/tx-without-codefile.yaml',
            __dirname,
          ),
          args,
        ),
        args,
      );

      expect(res.tplTx).deep.eq({
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

      const res = convertToKadenaClientTransaction(
        parseYamlKdaTx(
          replaceHolesInCtx(
            getPartsAndHolesInCtx('./aux-files/real-tx-tpl.yaml', __dirname),
            args,
          ),
          args,
        ).tplTx,
      );

      expect(res).toStrictEqual({
        codeFile: './aux-files/real-tx-tpl-code.pact',
        data: null,
        meta: {
          chainId: '1',
          sender:
            'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
          gasLimit: 2000,
          gasPrice: 1e-8,
          ttl: 7200,
        },
        networkId: 'testnet',
        nonce: undefined,
        signers: [
          {
            caps: [
              {
                name: 'coin.TRANSFER',
                args: [
                  'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
                  'my-gas-station',
                  {
                    '[object Object]': null,
                  },
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
        code: '(let\n    ((mk-guard (lambda (max-gas-price:decimal)\n                (util.guards.guard-or\n                  (keyset-ref-guard "ns-admin-keyset")\n                  (util.guards1.guard-all\n                    [ (create-user-guard (coin.gas-only))\n                      (util.guards1.max-gas-price max-gas-price)\n                      (util.guards1.max-gas-limit 500)\n                    ]))\n               )\n     )\n    )\n\n    (coin.transfer-create\n      "k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94"\n      "my-gas-station"\n      (mk-guard 0.0000000001)\n      123000)\n    (coin.rotate\n      "my-gas-station"\n      (mk-guard 0.00000001))\n  )\n',
        payload: {
          data: null,
          code: '(let\n    ((mk-guard (lambda (max-gas-price:decimal)\n                (util.guards.guard-or\n                  (keyset-ref-guard "ns-admin-keyset")\n                  (util.guards1.guard-all\n                    [ (create-user-guard (coin.gas-only))\n                      (util.guards1.max-gas-price max-gas-price)\n                      (util.guards1.max-gas-limit 500)\n                    ]))\n               )\n     )\n    )\n\n    (coin.transfer-create\n      "k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94"\n      "my-gas-station"\n      (mk-guard 0.0000000001)\n      123000)\n    (coin.rotate\n      "my-gas-station"\n      (mk-guard 0.00000001))\n  )\n',
        },
      });
    });
  });

  describe('convertYamlToKadenaClientTransaction', () => {
    it('converts a yaml with holes to KadenaClientTx', () => {
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

      const res = convertYamlToKadenaClientTransaction(
        './aux-files/real-tx-tpl.yaml',
        args,
        __dirname,
      );

      expect(res).toStrictEqual({
        codeFile: './aux-files/real-tx-tpl-code.pact',
        data: null,
        meta: {
          chainId: '1',
          sender:
            'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
          gasLimit: 2000,
          gasPrice: 1e-8,
          ttl: 7200,
        },
        networkId: 'testnet',
        nonce: undefined,
        signers: [
          {
            caps: [
              {
                name: 'coin.TRANSFER',
                args: [
                  'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
                  'my-gas-station',
                  {
                    '[object Object]': null,
                  },
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
        code: '(let\n    ((mk-guard (lambda (max-gas-price:decimal)\n                (util.guards.guard-or\n                  (keyset-ref-guard "ns-admin-keyset")\n                  (util.guards1.guard-all\n                    [ (create-user-guard (coin.gas-only))\n                      (util.guards1.max-gas-price max-gas-price)\n                      (util.guards1.max-gas-limit 500)\n                    ]))\n               )\n     )\n    )\n\n    (coin.transfer-create\n      "k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94"\n      "my-gas-station"\n      (mk-guard 0.0000000001)\n      123000)\n    (coin.rotate\n      "my-gas-station"\n      (mk-guard 0.00000001))\n  )\n',
        payload: {
          data: null,
          code: '(let\n    ((mk-guard (lambda (max-gas-price:decimal)\n                (util.guards.guard-or\n                  (keyset-ref-guard "ns-admin-keyset")\n                  (util.guards1.guard-all\n                    [ (create-user-guard (coin.gas-only))\n                      (util.guards1.max-gas-price max-gas-price)\n                      (util.guards1.max-gas-limit 500)\n                    ]))\n               )\n     )\n    )\n\n    (coin.transfer-create\n      "k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94"\n      "my-gas-station"\n      (mk-guard 0.0000000001)\n      123000)\n    (coin.rotate\n      "my-gas-station"\n      (mk-guard 0.00000001))\n  )\n',
        },
      });
    });
  });
});
