import { FileContractDefinition } from '../FileContractDefinition';
import { StringContractDefinition } from '../StringContractDefinition';

import path from 'path';

describe('FileContractDefinition', () => {
  it('lists an array of modules and methods of the coin contract', () => {
    const filePath = path.join(__dirname, './coin.contract.pact');
    const fileContractDefinition = new FileContractDefinition(filePath);

    expect(fileContractDefinition.modules).toEqual(['coin']);
    const methods = fileContractDefinition.getMethods('coin')!;
    expect(Object.keys(methods).length).toEqual(23);
  });
});

describe('StringContractDefinition', () => {
  it('lists an array of modules and methods of a simple contract', () => {
    const contract = `(module albert-coin
  (defun get-balance (address))
  (defun get-balance-two:number (address:string))
)`;
    const stringContractDefinition = new StringContractDefinition(contract);
    expect(stringContractDefinition.modules).toEqual(['albert-coin']);
    expect(stringContractDefinition.getMethods('albert-coin')).toEqual({
      'get-balance': {
        col: 10,
        line: 2,
        method: 'get-balance',
        returnType: 'undefined',
        args: {
          address: {
            line: 2,
            col: 23,
            name: 'address',
            type: 'undefined',
          },
        },
      },
      'get-balance-two': {
        col: 10,
        line: 3,
        method: 'get-balance-two',
        returnType: 'number',
        args: {
          address: {
            col: 34,
            line: 3,
            name: 'address',
            type: 'string',
          },
        },
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
