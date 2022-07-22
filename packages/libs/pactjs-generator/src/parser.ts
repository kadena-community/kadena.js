import { readFileSync, writeFileSync } from 'fs';
import nearley from 'nearley';
import { join } from 'path';
import grammar from './grammar.js';

async function main() {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  parser.feed(
    readFileSync(join(__dirname, './tests/coin.contract.pact'), 'utf8'),
  );
  parser.finish();
  const ast = parser.results[0];
  writeFileSync(
    join(__dirname, './tests/coin.contract.ast'),
    JSON.stringify(ast, null, 2),
  );
}

main();
