import { describe, expect, it } from 'vitest';
import {
  convertToKadenaClientTransaction,
  getPartsAndHolesInCtx,
  parseYamlKdaTx,
  replaceHoles,
  replaceHolesInCtx,
} from '../yaml-converter';

describe('yaml-converter', () => {
  describe('getPartsAndHoles', () => {
    it('parses a simple string', () => {
      expect(getPartsAndHolesInCtx('./simple-test.yml', __dirname)).deep.eq({
        cwd: '/Users/albert/projects/kadena-community/kadena.js-pull-requests/packages/libs/client-utils/src/core/test',
        tplPath: './simple-test.yml',
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
      expect(getPartsAndHolesInCtx('./complex-test.yml', __dirname)).deep.eq({
        cwd: '/Users/albert/projects/kadena-community/kadena.js-pull-requests/packages/libs/client-utils/src/core/test',
        tplPath: './complex-test.yml',
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
        getPartsAndHolesInCtx('./simple-test.yml', __dirname).tplString,
        {
          name: 'Albert',
        },
      );
      expect(result).eq(`Hello Albert!
`);
    });

    it('replaces holes for simple string', () => {
      const result = replaceHoles(
        getPartsAndHolesInCtx('./complex-test.yml', __dirname).tplString,
        {
          name: 'Albert',
          literalName: 'literalAlbert',
        },
      );
      expect(result).eq(`Hello Albert! Where is AlbertliteralAlbert!
`);
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
          getPartsAndHolesInCtx('./tx-with-codefile.yml', __dirname),
          args,
        ),
        args,
      );

      expect(res.tplTx).deep.eq({
        code: `(module 12 My Literal Name)
`,
        codeFile: './codefile.pact',
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
        'funding-key': '554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
        'owner-key':
          'f90ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
      };

      const res = convertToKadenaClientTransaction(
        parseYamlKdaTx(
          replaceHolesInCtx(
            getPartsAndHolesInCtx('./real-tx-tpl.yaml', __dirname),
            args,
          ),
          args,
        ).tplTx,
      );
      expect(res).toBe(
        'TODO: equal to a nice IPactCommand for signWithChainweaver 🤣',
      );
    });
  });
});
