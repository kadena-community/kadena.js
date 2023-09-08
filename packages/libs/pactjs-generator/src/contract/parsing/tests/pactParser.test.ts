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
});
