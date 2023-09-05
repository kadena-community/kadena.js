import { getBlockPointer, getPointer } from '../getPointer';

const contract = `(namespace free)(module test GOVERNANCE @doc "test module")`;

describe('getPointer functionality', () => {
  it('should return the pointer object', () => {
    const pointer = getPointer(contract);
    expect(pointer).toHaveProperty('next');
    expect(pointer).toHaveProperty('snapshot');
    expect(pointer).toHaveProperty('done');
    expect(pointer).toHaveProperty('reset');
  });

  describe('pointer.next', () => {
    // it("should skip 'model', 'comment', 'ws', 'nl'", () => {
    //   const pointer = getPointer(
    //     '; this is a comment\n     (module free GOVERNANCE \r\n @model [(test-model)])',
    //   );
    //   const tokens = ['(', 'module', 'free', 'GOVERNANCE', ')'];
    //   while (!pointer.done()) {
    //     const token = pointer.next();
    //     const tokenValue = tokens.shift();
    //     expect(token?.value).toBe(tokenValue);
    //   }
    //   expect(tokens).toHaveLength(0);
    // });

    // it('should return a valid token with type and value', () => {
    //   const pointer = getPointer('(namespace free)');
    //   expect(pointer.next()).toMatchObject({ value: '(', type: 'lparen' });
    //   expect(pointer.next()).toMatchObject({
    //     value: 'namespace',
    //     type: 'namespace',
    //   });
    //   expect(pointer.next()).toMatchObject({ value: 'free', type: 'atom' });
    //   expect(pointer.next()).toMatchObject({ value: ')', type: 'rparen' });
    // });

    it('should return all tokens from the contract', () => {
      const pointer = getPointer('(namespace free)(module test GOVERNANCE)');
      const tokens = [
        '(',
        'namespace',
        'free',
        ')',
        '(',
        'module',
        'test',
        'GOVERNANCE',
        ')',
      ];
      let idx = 0;
      while (!pointer.done()) {
        const token = pointer.next();
        expect(tokens[idx]).toBe(token?.value);
        idx += 1;
      }
      expect(idx).toBe(tokens.length);
    });

    it('should return undefined when tokes are returned', () => {
      const pointer = getPointer('(namespace free)');
      // skip 4 tokens
      for (let i = 0; i < 4; i++) {
        pointer.next();
      }
      expect(pointer.next()).toBeUndefined();
    });
  });

  describe('pointer.snapshot', () => {
    it('should change after every pointe.next call', () => {
      const pointer = getPointer('(namespace free)');
      const firstSnapshot = pointer.snapshot();
      pointer.next();
      expect(pointer.snapshot()).not.toBe(firstSnapshot);
    });
  });

  describe('pointer.reset', () => {
    it('should reset the pointer to the taken snapshot', () => {
      const pointer = getPointer('(namespace free)');
      const firstToken = pointer.next();
      const firstSnapshot = pointer.snapshot();
      const secondToken = pointer.next();

      expect(firstToken).not.toBe(secondToken);

      // skip two token
      pointer.next();
      pointer.next();

      pointer.reset(firstSnapshot);

      const tokenAfterReset = pointer.next();
      expect(tokenAfterReset).toBe(secondToken);
    });
  });

  describe('pointer.done', () => {
    it('should return false if pointer did not return all of the tokens', () => {
      const pointer = getPointer('(namespace free)');
      expect(pointer.done()).toBe(false);
      pointer.next();
      pointer.next();
      expect(pointer.done()).toBe(false);
    });

    it('should return false if pointer returned all of the tokens', () => {
      const pointer = getPointer('(namespace free)');
      expect(pointer.done()).toBe(false);
      for (let i = 0; i < 4; i++) pointer.next();
      expect(pointer.done()).toBe(true);
    });
  });
});

describe('getBlockPointer', () => {
  it('creates a pointer is scoped in a block', () => {
    const pointer = getPointer('(a (b (c) ) the_token_after_block_b )');
    // skip first (
    pointer.next();
    // skip a
    pointer.next();
    // skip the second (
    pointer.next();

    const blockPointer = getBlockPointer(pointer);

    while (!blockPointer.done()) {
      blockPointer.next();
    }

    expect(pointer.next()?.value).toBe('the_token_after_block_b');
  });
});
