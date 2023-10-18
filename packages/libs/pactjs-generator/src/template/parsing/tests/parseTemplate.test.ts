import { readFileSync } from 'fs';
import { join } from 'path';
import { parseTemplate } from '../parseTemplate';

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

  it('parses a YAML template', () => {
    const template = readFileSync(
      join(__dirname, './simple-transfer.yaml'),
      'utf8',
    );
    const result = parseTemplate(template);
    expect(result).toMatchSnapshot();
  });
});
