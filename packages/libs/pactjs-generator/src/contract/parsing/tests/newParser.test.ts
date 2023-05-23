import { parser } from '../newParser';

import fs from 'fs';
import path from 'path';

const contract = fs.readFileSync(path.join(__dirname, 'coin.pact'), 'utf-8');

describe('test ast parser', () => {
  it('test', () => {
    const tree = parser(contract);
    fs.writeFileSync(
      path.join(__dirname, 'coin.json'),
      JSON.stringify(tree, null, 2),
    );
  });
});
