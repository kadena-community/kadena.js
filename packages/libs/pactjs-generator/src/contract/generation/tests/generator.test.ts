import { generateDts } from '../generator';
import { StringContractDefinition } from '../StringContractDefinition';

describe('generator', () => {
  it('creates a typescript definition from a contract', () => {
    const contract: string = `(module coin
      (defun transfer:string (from:string to:string amount:decimal))
    )`;
    const parsedContract = new StringContractDefinition(contract);
    const dTs = generateDts(parsedContract.modulesWithFunctions)
      .get('coin')!
      .split(/[\s\n]/)
      .filter((x) => x !== '')
      .join(' ');
    const expected = `import type { ICommandBuilder } from '@kadena/client';
declare module '@kadena/client' {
  export type ICoinCaps = { }
  export interface IPactModules {
    "coin": {
      "transfer": (from: string, to: string, amount: number) => ICommandBuilder<ICoinCaps>
    }
  }
}`
      .split(/[\s\n]/)
      .filter((x) => x !== '')
      .join(' ');
    expect(dTs).toBe(expected);
  });

  it('creates a typescript definition with DEFCAPS from a contract', () => {
    const contract: string = `(module coin
      (defun transfer:string (from:string to:string amount:decimal))
      (defcap GAS ())
      (defcap TRANSFER (sender:string receiver:string amount:decimal))
    )`;
    const parsedContract = new StringContractDefinition(contract);
    const dTs = generateDts(parsedContract.modulesWithFunctions)
      .get('coin')!
      .split(/[\s\n]/)
      .filter((x) => x !== '')
      .join(' ');
    const expected = `import type { ICommandBuilder } from '@kadena/client';
declare module '@kadena/client' {
  export type ICoinCaps = {
    "coin.GAS": [ ],
    "coin.TRANSFER": [ sender: string, receiver: string, amount: number ]
  }
  export interface IPactModules {
    "coin": {
      "transfer": (from: string, to: string, amount: number) => ICommandBuilder<ICoinCaps>
    }
  }
}`
      .split(/[\s\n]/)
      .filter((x) => x !== '')
      .join(' ');
    expect(dTs).toBe(expected);
  });
});
