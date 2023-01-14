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
    const expected =
      `import type { ICommandBuilder, IPactCommand } from '@kadena/client';
declare module '@kadena/client' {
  export interface ICapabilities { }
  export interface IPactModules {
    "coin": {
      "transfer": (from: string, to: string, amount: number) => ICommandBuilder<ICapabilities> & IPactCommand
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
    const expected =
      `import type { ICommandBuilder, IPactCommand } from '@kadena/client';
declare module '@kadena/client' {
  export interface ICapabilities {
    "coin.GAS": [ ],
    "coin.TRANSFER": [ sender: string, receiver: string, amount: number ]
  }
  export interface IPactModules {
    "coin": {
      "transfer": (from: string, to: string, amount: number) => ICommandBuilder<ICapabilities> & IPactCommand
    }
  }
}`
        .split(/[\s\n]/)
        .filter((x) => x !== '')
        .join(' ');
    expect(dTs).toBe(expected);
  });

  it('creates a typescript definition without incompatible types', () => {
    const contract: string = `(module module-with-dashes
      (defun transfer:string (from:string to:string amount))
    )`;

    const parsedContract = new StringContractDefinition(contract);
    const dTs = generateDts(parsedContract.modulesWithFunctions)
      .get('module-with-dashes')!
      .split(/[\s\n]/)
      .filter((x) => x !== '')
      .join(' ');

    const expected =
      `import type { ICommandBuilder, IPactCommand } from '@kadena/client';
declare module '@kadena/client' {
  export interface ICapabilities {
  }
  export interface IPactModules {
    "module-with-dashes": {
      "transfer": (from: string, to: string, amount: any) => ICommandBuilder<ICapabilities> & IPactCommand
    }
  }
}`
        .split(/[\s\n]/)
        .filter((x) => x !== '')
        .join(' ');
    expect(dTs).toBe(expected);
  });

  it('creates a typescript definition without incompatible types', () => {
    const contract: string = `(module module-with-dashes
  (defun transfer:string (from:string to:string amount))
  (defcap GAS ())
  (defcap TRANSFER (from:string to:string amount))
)`;

    const parsedContract = new StringContractDefinition(contract);
    generateDts(parsedContract.modulesWithFunctions);
    const contractCaps = parsedContract.getCapabilities('module-with-dashes')!;
    const contractMethods = parsedContract.getMethods('module-with-dashes')!;

    expect(Object.keys(contractCaps)).toEqual(['GAS', 'TRANSFER']);
    expect(Object.keys(contractCaps.TRANSFER.args)).toEqual([
      'from',
      'to',
      'amount',
    ]);
    expect(Object.keys(contractMethods)).toEqual(['transfer']);
    expect(Object.keys(contractMethods.transfer.args)).toEqual([
      'from',
      'to',
      'amount',
    ]);
    expect(parsedContract.modules).toEqual(['module-with-dashes']);
  });

  it('creates a typescript definition with a namespace', () => {
    const contract: string = `(namespace 'free-namespace)
    (module the-free-module
      (defun transfer:string (from:string to:string amount:decimal))
    )`;
    const parsedContract = new StringContractDefinition(contract);
    const dTs = generateDts(parsedContract.modulesWithFunctions)
      .get('the-free-module')!
      .split(/[\s\n]/)
      .filter((x) => x !== '')
      .join(' ');
    const expected =
      `import type { ICommandBuilder, IPactCommand } from '@kadena/client';
declare module '@kadena/client' {
  export interface ICapabilities { }
  export interface IPactModules {
    "free-namespace.the-free-module": {
      "transfer": (from: string, to: string, amount: number) => ICommandBuilder<ICapabilities> & IPactCommand
    }
  }
}`
        .split(/[\s\n]/)
        .filter((x) => x !== '')
        .join(' ');
    expect(dTs).toBe(expected);
  });

  it('creates a typescript definition with DEFCAPS from a namespaced contract', () => {
    const contract: string = `(namespace 'free-namespace)
    (module the-free-module
    (defun transfer:string (from:string to:string amount:decimal))
    (defcap GAS ())
    (defcap TRANSFER (sender:string receiver:string amount:decimal))
  )`;
    const parsedContract = new StringContractDefinition(contract);
    const dTs = generateDts(parsedContract.modulesWithFunctions)
      .get('the-free-module')!
      .split(/[\s\n]/)
      .filter((x) => x !== '')
      .join(' ');
    const expected =
      `import type { ICommandBuilder, IPactCommand } from '@kadena/client';
declare module '@kadena/client' {
  export interface ICapabilities {
    "free-namespace.the-free-module.GAS": [ ],
    "free-namespace.the-free-module.TRANSFER": [ sender: string, receiver: string, amount: number ]
  }
  export interface IPactModules {
    "free-namespace.the-free-module": {
      "transfer": (from: string, to: string, amount: number) => ICommandBuilder<ICapabilities> & IPactCommand
    }
  }
}`
        .split(/[\s\n]/)
        .filter((x) => x !== '')
        .join(' ');
    expect(dTs).toBe(expected);
  });

  it('creates a typescript definition with a custom interface name', () => {
    const contract: string = `(namespace 'free-namespace)
    (module the-free-module
    (defun transfer:string (from:string to:string amount:decimal))
    (defcap GAS ())
    (defcap TRANSFER (sender:string receiver:string amount:decimal)))`;

    const parsedContract = new StringContractDefinition(contract);

    const dTs = generateDts(
      parsedContract.modulesWithFunctions,
      'IMyInterfaceName',
    )
      .get('the-free-module')!
      .split(/[\s\n]/)
      .filter((x) => x !== '')
      .join(' ');

    const expected =
      `import type { ICommandBuilder, IPactCommand } from '@kadena/client';
declare module '@kadena/client' {
  export interface IMyInterfaceName {
    "free-namespace.the-free-module.GAS": [ ],
    "free-namespace.the-free-module.TRANSFER": [ sender: string, receiver: string, amount: number ]
  }
  export interface IPactModules {
    "free-namespace.the-free-module": {
      "transfer": (from: string, to: string, amount: number) => ICommandBuilder<IMyInterfaceName> & IPactCommand
    }
  }
}`
        .split(/[\s\n]/)
        .filter((x) => x !== '')
        .join(' ');

    expect(dTs).toBe(expected);
  });
});
