import { describe, expect, it } from 'vitest';
import { unwrapData } from '../dataWrapper';
import { getPointer } from '../getPointer';
import { defcap, defun, method, moduleRule, typeRule } from '../pactGrammar';
import { FAILED } from '../parser-utilities';

describe('pactGrammar', () => {
  describe('typeRule parser', () => {
    it('should match the input if it is :type ', () => {
      const pointer = getPointer(':boolean');
      const result = typeRule(pointer);
      const data = unwrapData(result);
      expect(data).toEqual('boolean');
    });

    it('should match the input if it is :object{mod.schema-one} ', () => {
      const pointer = getPointer(':object{mod.schema-one}');
      const result = typeRule(pointer);
      const data = unwrapData(result);

      if (data === FAILED) {
        expect(data).not.toEqual(FAILED);
        return;
      }

      expect(data).toEqual({
        kind: 'object',
        value: 'mod.schema-one',
      });
    });
  });

  describe('defun parser', () => {
    it('should extract the name of the function', () => {
      const pointer = getPointer('(defun test () @doc "test doc")');
      const result = defun(pointer);
      const data = unwrapData(result);
      if (data === FAILED) {
        expect(data).not.toEqual(FAILED);
        return;
      }
      expect(data.name).toEqual('test');
    });

    it('should extract the return type of the function', () => {
      const pointer = getPointer('(defun test:boolean () @doc "test doc")');
      const result = defun(pointer);
      const data = unwrapData(result);
      if (data === FAILED) {
        expect(data).not.toEqual(FAILED);
        return;
      }
      expect(data.returnType).toEqual('boolean');
    });

    it('should extract the parameters of the function', () => {
      const pointer = getPointer(
        '(defun test (a:integer b:boolean) @doc "test doc")',
      );
      const result = defun(pointer);
      const data = unwrapData(result);
      if (data === FAILED) {
        expect(data).not.toEqual(FAILED);
        return;
      }
      expect(data.parameters).toEqual([
        { name: 'a', type: 'integer' },
        { name: 'b', type: 'boolean' },
      ]);
    });

    it('should extract the documentation of the function', () => {
      const pointer = getPointer(
        '(defun test (a:integer b:boolean) @doc "test doc")',
      );
      const result = defun(pointer);
      const data = unwrapData(result);
      if (data === FAILED) {
        expect(data).not.toEqual(FAILED);
        return;
      }
      expect(data.doc).toEqual('test doc');
    });

    it("should extract required-capabilities from the function's body", () => {
      const pointer = getPointer(
        '(defun test (a:integer b:boolean) @doc "test doc" (require-capability (CAP1)) (require-capability (CAP2)))',
      );
      const result = defun(pointer);
      const data = unwrapData(result);
      if (data === FAILED) {
        expect(data).not.toEqual(FAILED);
        return;
      }
      expect(data.requiredCapabilities).toEqual(['CAP1', 'CAP2']);
    });

    it("should extract with-capabilities from the function's body", () => {
      const pointer = getPointer(
        '(defun test (a:integer b:boolean) @doc "test doc" (with-capability (CAP1)) (with-capability (CAP2)))',
      );
      const result = defun(pointer);
      const data = unwrapData(result);
      if (data === FAILED) {
        expect(data).not.toEqual(FAILED);
        return;
      }
      expect(data.withCapabilities).toEqual(['CAP1', 'CAP2']);
    });

    it("should extract external module function calls from the function's body", () => {
      const pointer = getPointer(
        '(defun test (a:integer b:boolean) @doc "test doc" (namespace1.mod1.func1 1) (mod2.func2 "test"))',
      );
      const result = defun(pointer);
      const data = unwrapData(result);
      if (data === FAILED) {
        expect(data).not.toEqual(FAILED);
        return;
      }
      expect(data.externalFnCalls).toEqual([
        {
          namespace: 'namespace1',
          module: 'mod1',
          func: 'func1',
        },
        {
          module: 'mod2',
          func: 'func2',
        },
      ]);
    });
  });

  describe('defcap parser', () => {
    it('should extract the name of the capability', () => {
      const pointer = getPointer('(defcap test () @doc "test doc")');
      const result = defcap(pointer);
      if (result === FAILED) {
        expect(result).not.toEqual(FAILED);
        return;
      }
      const data = unwrapData(result);
      expect(data.name).toEqual('test');
    });

    it('should extract the parameters of the capability', () => {
      const pointer = getPointer(
        '(defcap test (a:integer b:boolean) @doc "test doc")',
      );
      const result = defcap(pointer);
      if (result === FAILED) {
        expect(result).not.toEqual(FAILED);
        return;
      }
      const data = unwrapData(result);
      expect(data.parameters).toEqual([
        { name: 'a', type: 'integer' },
        { name: 'b', type: 'boolean' },
      ]);
    });

    it('should extract the documentation of the capability', () => {
      const pointer = getPointer('(defcap test () @doc "test doc")');
      const result = defcap(pointer);
      if (result === FAILED) {
        expect(result).not.toEqual(FAILED);
        return;
      }
      const data = unwrapData(result);
      expect(data.doc).toEqual('test doc');
    });

    it("should extract compose-capabilities from the capability's body", () => {
      const pointer = getPointer(
        '(defcap test () @doc "test doc" (compose-capability (CAP1)) (compose-capability (CAP2)))',
      );
      const result = defcap(pointer);
      if (result === FAILED) {
        expect(result).not.toEqual(FAILED);
        return;
      }
      const data = unwrapData(result);
      expect(data.composeCapabilities).toEqual(['CAP1', 'CAP2']);
    });

    it("should extract managed from the capability's body", () => {
      const pointer = getPointer(
        '(defcap test () @doc "test doc" @managed prop manager_fn)',
      );
      const result = defcap(pointer);
      if (result === FAILED) {
        expect(result).not.toEqual(FAILED);
        return;
      }
      const data = unwrapData(result);
      expect(data.managed).toEqual({ property: 'prop', manager: 'manager_fn' });
    });

    it("should extract managed as boolean from the capability's body if it does not mention a specific property", () => {
      const pointer = getPointer('(defcap test () @doc "test doc" @managed)');
      const result = defcap(pointer);
      if (result === FAILED) {
        expect(result).not.toEqual(FAILED);
        return;
      }
      const data = unwrapData(result);
      expect(data.managed).toBe(true);
    });
  });

  describe('moduleRule parser', () => {
    it('should extract the kind if its module', () => {
      const pointer = getPointer('(module test GOVERNANCE @doc "test doc" )');
      const result = moduleRule(pointer);
      if (result === FAILED) {
        expect(result).not.toEqual(FAILED);
        return;
      }
      const data = unwrapData(result);
      expect(data.kind).toEqual('module');
    });

    it('should extract the name of the module', () => {
      const pointer = getPointer('(module test GOVERNANCE @doc "test doc")');
      const result = moduleRule(pointer);
      if (result === FAILED) {
        expect(result).not.toEqual(FAILED);
        return;
      }
      const data = unwrapData(result);
      expect(data.name).toEqual('test');
    });

    it('should extract the governance of the module', () => {
      const pointer = getPointer('(module test GOVERNANCE @doc "test doc")');
      const result = moduleRule(pointer);
      if (result === FAILED) {
        expect(result).not.toEqual(FAILED);
        return;
      }
      const data = unwrapData(result);
      expect(data.governance).toEqual('GOVERNANCE');
    });

    it('should extract the documentation of the module', () => {
      const pointer = getPointer('(module test GOVERNANCE @doc "test doc")');
      const result = moduleRule(pointer);
      if (result === FAILED) {
        expect(result).not.toEqual(FAILED);
        return;
      }
      const data = unwrapData(result);
      expect(data.doc).toEqual('test doc');
    });

    it("should extract the module's functions", () => {
      const pointer = getPointer(
        '(module test GOVERNANCE @doc "test doc" (defun test () @doc "test doc") (defun test2 () @doc "test doc"))',
      );
      const result = moduleRule(pointer);
      if (result === FAILED) {
        expect(result).not.toEqual(FAILED);
        return;
      }
      const data = unwrapData(result);
      expect(data.functions?.map(({ name, doc }) => ({ name, doc }))).toEqual([
        {
          name: 'test',
          doc: 'test doc',
        },
        {
          name: 'test2',
          doc: 'test doc',
        },
      ]);
    });

    it("should extract the module's capabilities", () => {
      const pointer = getPointer(
        '(module test GOVERNANCE @doc "test doc" (defcap test () @doc "test doc") (defcap test2 () @doc "test doc"))',
      );
      const result = moduleRule(pointer);
      if (result === FAILED) {
        expect(result).not.toEqual(FAILED);
        return;
      }
      const data = unwrapData(result);
      expect(
        data.capabilities?.map(({ name, doc }) => ({ name, doc })),
      ).toEqual([
        {
          name: 'test',
          doc: 'test doc',
        },
        {
          name: 'test2',
          doc: 'test doc',
        },
      ]);
    });

    it('should extract the kind if its interface', () => {
      const pointer = getPointer('(interface test @doc "test doc" )');
      const result = moduleRule(pointer);
      if (result === FAILED) {
        expect(result).not.toEqual(FAILED);
        return;
      }
      const data = unwrapData(result);
      expect(data.kind).toEqual('interface');
    });
  });

  describe('method rule', () => {
    it('uses skipTheRest of the bodyParser is not presented', () => {
      const defun = method('defun');
      const pointer = getPointer('(defun test () (with-capability (test)))');
      const tree = unwrapData(defun(pointer));
      if (tree === FAILED) {
        expect(tree).not.toBe(FAILED);
        return;
      }
      expect('bodyPointer' in tree).toBe(false);
    });
  });
});
