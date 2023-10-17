import { pactParser } from '../pactParser';

describe('pactParser', () => {
  it('should parse a contract from content', async () => {
    const contract = `
      (module coin GOVERNANCE
        (defun transfer:string (sender:string receiver:string amount:number))
      )`;

    const getContract = (): Promise<string> => Promise.resolve('');
    const modules = await pactParser({ files: [contract], getContract });
    expect(Object.keys(modules)).toHaveLength(1);
    const coin = modules.coin;
    expect(coin).toBeDefined();
    expect(coin.name).toBe('coin');
    expect(coin.kind).toBe('module');
  });

  it('should throw an exception if the content is not parsable as a contract', async () => {
    const contract = `this is an invalid syntax`;

    const getContract = (): Promise<string> => Promise.resolve('');
    await expect(() =>
      pactParser({ files: [contract], getContract }),
    ).rejects.toEqual(Error('NO_MODULE_LOADED'));
  });

  it('should throw an exception if the getContent returns an invalid module', async () => {
    const contract = `
      (use test_namespace.test_module)
      (module coin GOVERNANCE
        (defun transfer:string (sender:string receiver:string amount:number)
        )
      )`;

    const getContract = jest
      .fn()
      .mockResolvedValue('return invalid module content');

    await pactParser({ files: [contract], getContract });

    expect(getContract.mock.calls).toHaveLength(1);
    expect(getContract.mock.calls[0][0]).toBe('test_namespace.test_module');
  });

  it('should use getContract for fetching contract content', async () => {
    const getContract = jest.fn().mockResolvedValue(`
      (module coin GOVERNANCE
        (defun transfer:string (sender:string receiver:string amount:number))
      )`);

    const modules = await pactParser({ contractNames: ['coin'], getContract });
    expect(Object.keys(modules)).toHaveLength(1);
    const coin = modules.coin;
    expect(coin).toBeDefined();
    expect(coin.name).toBe('coin');
    expect(coin.kind).toBe('module');
    expect(getContract.mock.calls).toHaveLength(1);
    expect(getContract.mock.calls[0][0]).toBe('coin');
  });

  it('should use the parent contract namespace for used contracts if they dont have a namespace', async () => {
    const getContract = jest.fn((name: string) => {
      switch (name) {
        case 'custom-namespace.test':
          return Promise.resolve(`
            (module test GOVERNANCE
              (use l2)
              (defun transfer:string (sender:string receiver:string amount:number))
            )`);

        case 'custom-namespace.l2':
          return Promise.resolve(`
            (module l2 GOVERNANCE
              (defun func:string (sender:string receiver:string amount:number))
            )`);
        case 'l2':
          return Promise.reject('This should not be called');
        default:
          return Promise.reject(`invalid contract name - ${name}`);
      }
    });

    const modules = await pactParser({
      contractNames: ['custom-namespace.test'],
      getContract,
    });
    expect(Object.keys(modules)).toHaveLength(2);
    const mod = modules['custom-namespace.test'];
    expect(mod).toBeDefined();
    expect(mod.name).toBe('test');
    expect(mod.namespace).toBe('custom-namespace');
    expect(mod.kind).toBe('module');

    const l2 = modules['custom-namespace.l2'];
    expect(l2).toBeDefined();
    expect(l2.name).toBe('l2');
    expect(l2.namespace).toBe('custom-namespace');
    expect(l2.kind).toBe('module');

    expect(getContract.mock.calls).toHaveLength(2);
    expect(getContract.mock.calls[0][0]).toBe('custom-namespace.test');
    expect(getContract.mock.calls[1][0]).toBe('custom-namespace.l2');
  });

  it('should try both with and without parent namespace if module does not have namespace', async () => {
    const getContract = jest.fn((name: string) => {
      switch (name) {
        case 'custom-namespace.test':
          return Promise.resolve(`
            (module test GOVERNANCE
              (use l2)
              (defun transfer:string (sender:string receiver:string amount:number))
            )`);

        case 'custom-namespace.l2':
          return Promise.reject("This module doesn't exist");
        case 'l2':
          return Promise.resolve(`
            (module l2 GOVERNANCE
              (defun func:string (sender:string receiver:string amount:number))
            )`);
        default:
          return Promise.reject(`invalid contract name - ${name}`);
      }
    });

    const modules = await pactParser({
      contractNames: ['custom-namespace.test'],
      getContract,
    });
    expect(Object.keys(modules)).toHaveLength(2);
    const mod = modules['custom-namespace.test'];
    expect(mod).toBeDefined();
    expect(mod.name).toBe('test');
    expect(mod.namespace).toBe('custom-namespace');
    expect(mod.kind).toBe('module');

    const l2 = modules.l2;
    expect(l2).toBeDefined();
    expect(l2.name).toBe('l2');
    expect(l2.namespace).toBe('');
    expect(l2.kind).toBe('module');

    expect(getContract.mock.calls).toHaveLength(3);
    expect(getContract.mock.calls[0][0]).toBe('custom-namespace.test');
    expect(getContract.mock.calls[1][0]).toBe('custom-namespace.l2');
    expect(getContract.mock.calls[2][0]).toBe('l2');
  });

  it('should add the relevant namespace to the module', async () => {
    const contract = `
      (namespace "test_namespace_1")
      (namespace "test_namespace_2")
      (module test_module GOVERNANCE
        (defun transfer:string (sender:string receiver:string amount:number))
      )
      (namespace "test_namespace_3")
      `;

    const getContract = (name: string): Promise<string> =>
      Promise.resolve(name);
    const modules = await pactParser({ files: [contract], getContract });
    expect(Object.keys(modules)).toHaveLength(1);
    const testModule = modules['test_namespace_2.test_module'];
    expect(testModule).toBeDefined();
    expect(testModule.namespace).toBe('test_namespace_2');
  });

  it('should add relevant global used module to the module usedModules array', async () => {
    const contract = `
      ; this should be added to the list
      (use test_namespace.test_contract [test_fun])
      (module test_module GOVERNANCE
        (defun transfer:string (sender:string receiver:string amount:number))
      )
      ; this one shouldn't be in the list
      (use test_namespace.another_contract)
      `;

    const getContract = (): Promise<string> => Promise.resolve('');
    const modules = await pactParser({ files: [contract], getContract });
    expect(Object.keys(modules)).toHaveLength(1);
    const testModule = modules.test_module;
    expect(testModule).toBeDefined();
    expect(testModule.usedModules).toEqual([
      {
        name: 'test_contract',
        namespace: 'test_namespace',
        imports: ['test_fun'],
      },
    ]);
  });

  it('should add relevant used module to the module usedModules array if it is used inside a function body', async () => {
    const contract = `
      (module test_module GOVERNANCE
        (defun transfer:string (sender:string receiver:string amount:number)
           (coin.transfer sender receiver amount)
        )
      )
      `;

    const getContract = (): Promise<string> => Promise.resolve('');
    const modules = await pactParser({ files: [contract], getContract });
    expect(Object.keys(modules)).toHaveLength(1);
    const testModule = modules.test_module;
    expect(testModule).toBeDefined();
    expect(testModule.usedModules).toEqual([{ name: 'coin', namespace: '' }]);
  });

  it('should add only used module to the list', async () => {
    const contract = `
      (module first_module GOVERNANCE
        (defun first_fun:string (sender:string receiver:string amount:number)
           (coin.transfer sender receiver amount)
        )
      )
      (module not_used_module GOVERNANCE)
      (module test_module GOVERNANCE
        (use first_module)
        (defun transfer:string (sender:string receiver:string amount:number)
           (first_fun sender receiver amount)
        )
      )
      `;

    const getContract = (): Promise<string> => Promise.resolve('');
    const modules = await pactParser({ files: [contract], getContract });
    expect(Object.keys(modules)).toHaveLength(3);
    const testModule = modules.test_module;
    expect(testModule).toBeDefined();
    expect(testModule.usedModules).toHaveLength(1);
    expect(testModule.usedModules).toEqual([{ name: 'first_module' }]);
  });
  it('should parse a contract with power symbol "^"', async () => {
    const contract = `
      (module test_module GOVERNANCE
        (defun test_fun:string (a:integer p:integer)
           (^ a p)
        )
      )
      `;

    const getContract = (): Promise<string> => Promise.resolve('');
    const modules = await pactParser({ files: [contract], getContract });
    expect(Object.keys(modules)).toHaveLength(1);
    const testModule = modules.test_module;
    expect(testModule).toBeDefined();
    expect(testModule.name).toBe('test_module');
    expect(testModule.kind).toBe('module');
    expect(testModule.functions).toHaveLength(1);
    expect(testModule.functions![0].name).toBe('test_fun');
  });

  it('parses a function with list as return type', async () => {
    const contract = `
      (module test_module GOVERNANCE
        (defun get-events-list:[object{networking-event-schema}] ()
          @doc "Get all events"
          (with-capability (OPS)
            (select networking-events-table (where "deleted-at" (= -1)))
          )
        )
      )
      `;

    const getContract = (): Promise<string> => Promise.resolve('');
    const modules = await pactParser({ files: [contract], getContract });
    expect(Object.keys(modules)).toHaveLength(1);
    const testModule = modules.test_module;
    expect(testModule).toBeDefined();
    expect(testModule.name).toBe('test_module');
    expect(testModule.kind).toBe('module');
    expect(testModule.functions).toHaveLength(1);
    expect(testModule.functions![0].name).toBe('get-events-list');
    expect(testModule.functions![0].returnType).toEqual({
      kind: 'object',
      value: 'networking-event-schema',
      isList: true,
    });
  });
});
