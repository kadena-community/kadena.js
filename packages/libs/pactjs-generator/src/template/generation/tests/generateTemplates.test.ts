import { readFileSync } from 'fs';
import { join } from 'path';
import { parseTemplate } from '../../parsing/parseTemplate';
import { generateTemplates } from '../generateTemplates';

describe('generateDts', () => {
  it('generates a ts for `Hello, ${name}!`', () => {
    const ts = generateTemplates(
      [
        {
          name: 'hello-name',
          template: { parts: ['Hello, ', '!'], holes: ['name'] },
        },
      ],
      '0.0.1-alpha-test',
    );

    expect(ts).toMatchSnapshot();
  });

  it('generates a ts for a full template', () => {
    const simpleTransferTpl = parseTemplate(
      readFileSync(
        join(__dirname, '../my-tx-lib/src/simple-transfer.json'),
        'utf8',
      ),
    );

    const safeTransactionTpl = parseTemplate(
      readFileSync(
        join(__dirname, '../my-tx-lib/src/safe-transaction.yaml'),
        'utf8',
      ),
    );

    const ts = generateTemplates(
      [
        {
          name: 'simple-transfer',
          template: simpleTransferTpl,
        },
        {
          name: 'safe-transaction',
          template: safeTransactionTpl,
        },
      ],
      '0.0.1-alpha-test',
    );

    expect(ts).toMatchSnapshot();
  });
});
