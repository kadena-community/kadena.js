import { readFile } from 'fs/promises';
import path from 'path';
import { FileContractDefinition, PactTypescriptGenerator } from '../generator';

describe('FileContractDefinition', () => {
  it('reads a file', () => {
    const filePath = path.join(__dirname, './coin.contract.pact');
    const fileContractDefinition = new FileContractDefinition(filePath);
    // expect(fileContractDefinition.filePath).toBe(filePath);
  });
});

describe('pact generator', () => {
  it('creates typescript definition based on contract', async () => {
    const pactCoinContract = await readFile(
      path.join(__dirname, './coin.contract.pact'),
    );

    const generator = new PactTypescriptGenerator([
      new PactContract(pactCoinContract),
    ]);
    generator.generate();
    const typescriptDefinition = generator.toString();

    expect(typescriptDefinition).toBe(``);
  });
});
