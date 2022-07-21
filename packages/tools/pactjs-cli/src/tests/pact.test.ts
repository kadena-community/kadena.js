import { readFile } from 'fs/promises';
import path from 'path';

describe('pact generator', () => {
  it('creates typescript definition based on contract', async () => {
    const pactCoinContract = await readFile(path.join(__dirname, './coin.contract.pact'));


  });
});
