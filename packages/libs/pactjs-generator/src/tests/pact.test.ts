import path from 'path';
import { FileContractDefinition, StringContractDefinition } from '../generator';

describe('FileContractDefinition', () => {
  it('lists an array of modules and methods', () => {
    const filePath = path.join(__dirname, './coin.contract.pact');
    const fileContractDefinition = new FileContractDefinition(filePath);

    expect(fileContractDefinition.modules).toEqual(['coin']);
    const methods = fileContractDefinition.getMethods('coin')!;
    expect(Object.keys(methods).length).toEqual(23);
  });
});

describe('StringContractDefinition', () => {
  it('lists an array of modules and methods', () => {
    const contract = `(module albert-coin
  (defun get-balance (address)
  (defun get-balance:number (address:string)
)`;
    const stringContractDefinition = new StringContractDefinition(
      contract,
      console.log,
    );
    expect(stringContractDefinition.modules).toEqual(['albert-coin']);
    expect(stringContractDefinition.getMethods('albert-coin')).toEqual({
      'get-balance': {
        args: {
          adress: {
            line: 2,
            col: 23,
            method: 'get-balance',
            returnType: undefined,
          },
        },
        col: 10,
        line: 2,
        method: 'get-balance',
        returnType: undefined,
      },
      'get-balance:number': {
        args: {
          'address:string': {
            col: 30,
            line: 3,
            name: 'address',
            type: 'string',
          },
        },
        col: 10,
        line: 3,
        method: 'get-balance',
        returnType: 'number',
      },
    });
  });
});

// describe('pact generator', () => {
//   it('creates typescript definition based on contract', async () => {
//     const pactCoinContract = await readFile(
//       path.join(__dirname, './coin.contract.pact'),
//     );

//     const generator = new PactTypescriptGenerator([
//       new PactContract(pactCoinContract),
//     ]);
//     generator.generate();
//     const typescriptDefinition = generator.toString();

//     expect(typescriptDefinition).toBe(``);
//   });
// });
