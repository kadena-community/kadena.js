jest.mock('fs');
import { FileContractDefinition } from '../FileContractDefinition';

import { vol } from 'memfs';

vol.fromJSON({
  './path/not-namespaced.pact': '(module foo)',
  './path/namespaced.pact': "(namespace 'free) (module foo)",
  './path/namespaced-with-defuns.pact':
    "(namespace 'free) (module foo (defun bar:bool () true) (defun foo:bool () false))",
  './path/namespaced-with-defcaps.pact':
    "(namespace 'free) (module foo (defcap bar:bool () true) (defcap foo:bool () false))",
  './path/namespaced-with-defcaps-and-defuns.pact':
    "(namespace 'free) (module foo (defcap bar:bool () true) (defcap foo:bool () false) (defun bar:bool () true) (defun foo:bool () false))",
});

describe('FileContractDefinition', () => {
  describe('namespace', () => {
    it('gets set when provided as an argument', () => {
      const contractDefinition = new FileContractDefinition({
        path: './path/not-namespaced.pact',
        namespace: 'bar',
      });

      expect(contractDefinition.getNamespace('foo')).toBe('bar');
    });

    it('gets set to the one defined in the contract when NOT provided as an argument', () => {
      const contractDefinition = new FileContractDefinition({
        path: './path/namespaced.pact',
      });

      expect(contractDefinition.getNamespace('foo')).toBe('free');
    });

    it('does NOT get set when NOT defined in the contract and NOT provided as an argument', () => {
      const contractDefinition = new FileContractDefinition({
        path: './path/not-namespaced.pact',
      });

      expect(contractDefinition.getNamespace('foo')).toBe('');
    });
  });

  it('returns the defcaps of the contract', () => {
    const contractDefinition = new FileContractDefinition({
      path: './path/namespaced-with-defcaps.pact',
    });

    expect(contractDefinition.getCapabilities('foo')).toEqual({
      bar: {
        defcap: 'bar',
        args: {},
        col: 39,
        line: 1,
      },
      foo: {
        defcap: 'foo',
        args: {},
        col: 65,
        line: 1,
      },
    });
  });

  it('returns the modules of the contract', () => {
    const contractDefinition = new FileContractDefinition({
      path: './path/namespaced-with-defuns.pact',
    });

    expect(contractDefinition.modules).toEqual(['foo']);
  });

  it('returns the methods of the contract', () => {
    const contractDefinition = new FileContractDefinition({
      path: './path/namespaced-with-defuns.pact',
    });

    expect(contractDefinition.getMethods('foo')).toEqual({
      bar: {
        args: {},
        col: 38,
        line: 1,
        method: 'bar',
        returnType: 'bool',
      },
      foo: {
        args: {},
        col: 63,
        line: 1,
        method: 'foo',
        returnType: 'bool',
      },
    });
  });

  it('returns the modules with functions of the contract', () => {
    const contractDefinition = new FileContractDefinition({
      path: './path/namespaced-with-defcaps-and-defuns.pact',
    });

    expect(contractDefinition.modulesWithFunctions).toEqual({
      foo: {
        col: 27,
        defcaps: {
          bar: { args: {}, col: 39, defcap: 'bar', line: 1 },
          foo: { args: {}, col: 65, defcap: 'foo', line: 1 },
        },
        defuns: {
          bar: {
            args: {},
            col: 91,
            line: 1,
            method: 'bar',
            returnType: 'bool',
          },
          foo: {
            args: {},
            col: 116,
            line: 1,
            method: 'foo',
            returnType: 'bool',
          },
        },
        line: 1,
        name: 'foo',
        namespace: 'free',
      },
    });
  });
});
