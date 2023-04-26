import { FileContractDefinition } from '../../generation/FileContractDefinition';
import { StringContractDefinition } from '../../generation/StringContractDefinition';

import path from 'node:path';

describe('parser', () => {
  it('parses typed defun', () => {
    const contract = `
      (module coin GOVERNANCE
        (defun transfer:string (sender:string receiver:string amount:number))
      )`;
    const contractDefinition = new StringContractDefinition({
      contract,
      //logger: console.log,
    });
    expect(contractDefinition.modules).toEqual(['coin']);
    const methods = contractDefinition.getMethods('coin')!;
    expect(Object.keys(methods)).toHaveLength(1);
    expect(methods.transfer).toBeDefined();
    expect(methods.transfer.returnType).toEqual('string');
    expect(methods.transfer.args.sender.type).toEqual('string');
    expect(methods.transfer.args.receiver.type).toEqual('string');
    expect(methods.transfer.args.amount.type).toEqual('number');
  });

  it('parses typed and untyped defuns', () => {
    const contract = `
      (module coin GOVERNANCE
        (defun transfer:string (sender:string receiver:string amount:number))
        (defun untypedFn (firstArg secondArg))
      )`;
    const contractDefinition = new StringContractDefinition({
      contract,
      // logger: console.log,
    });
    expect(contractDefinition.modules).toEqual(['coin']);
    const methods = contractDefinition.getMethods('coin')!;
    expect(Object.keys(methods)).toHaveLength(2);
    expect(methods.untypedFn).toBeDefined();
    expect(methods.untypedFn.returnType).toBe('undefined');
    expect(methods.untypedFn.args.firstArg.type).toBe('undefined');
    expect(methods.untypedFn.args.secondArg.type).toBe('undefined');
  });

  it('parses namespaces', () => {
    const contract = `(namespace 'free)
      (module test-on-free GOVERNANCE
        (defun transfer:string (sender:string receiver:string amount:number))
        (defun untypedFn (firstArg secondArg))
      )`;
    const contractDefinition = new StringContractDefinition({
      contract,
      // logger: console.log,
    });
    expect(contractDefinition.modules).toEqual(['test-on-free']);
    expect(contractDefinition.getNamespace('test-on-free')).toEqual('free');
    const methods = contractDefinition.getMethods('test-on-free')!;
    expect(Object.keys(methods)).toHaveLength(2);
    expect(methods.untypedFn).toBeDefined();
    expect(methods.untypedFn.returnType).toBe('undefined');
    expect(methods.untypedFn.args.firstArg.type).toBe('undefined');
    expect(methods.untypedFn.args.secondArg.type).toBe('undefined');
  });

  it('parses namespaces with string as namespace', () => {
    const contract = `(namespace "free")
      (define-keyset "free.stake-for-steak-keyset" (read-keyset 'stake-for-steak-keyset))
      (module test-on-free GOVERNANCE
        (defun transfer:string (sender:string receiver:string amount:number))
        (defun untypedFn (firstArg secondArg))
      )`;
    const contractDefinition = new StringContractDefinition({
      contract,
      // logger: console.log,
    });
    expect(contractDefinition.modules).toEqual(['test-on-free']);
    expect(contractDefinition.getNamespace('test-on-free')).toEqual('free');
    const methods = contractDefinition.getMethods('test-on-free')!;
    expect(Object.keys(methods)).toHaveLength(2);
    expect(methods.untypedFn).toBeDefined();
    expect(methods.untypedFn.returnType).toBe('undefined');
    expect(methods.untypedFn.args.firstArg.type).toBe('undefined');
    expect(methods.untypedFn.args.secondArg.type).toBe('undefined');
  });

  it('parses namespaces with other statements inbetween', () => {
    const contract = `(namespace 'free)
      (define-keyset "free.stake-for-steak-keyset" (read-keyset 'stake-for-steak-keyset))
      (module test-on-free GOVERNANCE
        (defun transfer:string (sender:string receiver:string amount:number))
        (defun untypedFn (firstArg secondArg))
      )`;
    const contractDefinition = new StringContractDefinition({
      contract,
      // logger: console.log,
    });
    expect(contractDefinition.modules).toEqual(['test-on-free']);
    expect(contractDefinition.getNamespace('test-on-free')).toEqual('free');
    const methods = contractDefinition.getMethods('test-on-free')!;
    expect(Object.keys(methods)).toHaveLength(2);
    expect(methods.untypedFn).toBeDefined();
    expect(methods.untypedFn.returnType).toBe('undefined');
    expect(methods.untypedFn.args.firstArg.type).toBe('undefined');
    expect(methods.untypedFn.args.secondArg.type).toBe('undefined');
  });

  it('lexer test.contract.pact', () => {
    const filePath = path.join(__dirname, './test.contract.pact');
    const fileContractDefinition = new FileContractDefinition({
      filePath: filePath,
      // logger: console.log,
    });

    expect(fileContractDefinition.modules).toEqual(['coin']);
    const methods = fileContractDefinition.getMethods('coin')!;
    expect(Object.keys(methods)).toEqual([
      'transfer',
      'account-guard',
      'get-policy-info',
    ]);
    expect(
      Object.keys(methods.transfer.args).map(
        (a) => methods.transfer.args[a].name,
      ),
    ).toEqual(['sender', 'receiver', 'amount']);
    expect(
      Object.keys(methods.transfer.args).map(
        (a) => methods.transfer.args[a].type,
      ),
    ).toEqual(['string', 'string', 'number']);
  });

  it('marmalade.contract.pact', () => {
    const filePath = path.join(__dirname, './marmalade.contract.pact');
    const fileContractDefinition = new FileContractDefinition({
      filePath,
      // logger: console.log,
    });

    expect(fileContractDefinition.modules).toEqual(['ledger']);
    const methods = fileContractDefinition.getMethods('ledger')!;
    expect(Object.keys(methods).length).toEqual(29);
  });

  it('parses defcap', () => {
    const contract = `
      (module coin GOVERNANCE
        (defcap GAS ())
        (defcap TRANSFER (sender:string receiver:string amount:decimal))
      )`;
    const contractDefinition = new StringContractDefinition({
      contract,
      // logger: console.log,
    });
    expect(contractDefinition.modules).toEqual(['coin']);
    const capabilities = contractDefinition.getCapabilities('coin')!;
    expect(Object.keys(capabilities)).toEqual(['GAS', 'TRANSFER']);
    expect(Object.keys(capabilities.TRANSFER.args)).toEqual([
      'sender',
      'receiver',
      'amount',
    ]);
    expect(capabilities.TRANSFER.args.sender.type).toBe('string');
    expect(capabilities.TRANSFER.args.receiver.type).toBe('string');
    expect(capabilities.TRANSFER.args.amount.type).toBe('decimal');
  });
});
