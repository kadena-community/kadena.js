import { condenseStrings } from '../condenseStrings';

describe('condenseString', () => {
  const singleWord =
    'thisisaverylongstringthatshouldbecondensedthisisaverylongstringthatshouldbecondensed';
  const multiWord =
    'thisisaverylongstringthatshouldbecond ensedthisisaverylongstringthatshouldbecondensed thisIsAshorterString';

  describe('with default options', () => {
    it('condenses a single string', () => {
      expect(condenseStrings(singleWord)).toBe('thisi…ensed');
    });

    it('condenses a string with multiple words', () => {
      expect(condenseStrings(multiWord)).toBe(
        'thisi…econd ensed…ensed thisIsAshorterString',
      );
    });
  });
  describe('with custom options', () => {
    it('minLength 10', () => {
      expect(condenseStrings(singleWord, { minLength: 10 })).toBe(
        'thisi…ensed',
      );
      expect(condenseStrings(multiWord, { minLength: 10 })).toBe(
        'thisi…econd ensed…ensed thisI…tring',
      );
    });

    it('replacement "..."', () => {
      expect(condenseStrings(singleWord, { replacement: '...' })).toBe(
        'thisi...ensed',
      );
      expect(condenseStrings(multiWord, { replacement: '...' })).toBe(
        'thisi...econd ensed...ensed thisIsAshorterString',
      );
    });

    it('startLength 10', () => {
      expect(condenseStrings(singleWord, { startLength: 10 })).toBe(
        'thisisaver…ensed',
      );
      expect(condenseStrings(multiWord, { startLength: 10 })).toBe(
        'thisisaver…econd ensedthisi…ensed thisIsAshorterString',
      );
    });

    it('endLength 10', () => {
      expect(condenseStrings(singleWord, { endLength: 10 })).toBe(
        'thisi…econdensed',
      );
      expect(condenseStrings(multiWord, { endLength: 10 })).toBe(
        'thisi…ouldbecond ensed…econdensed thisIsAshorterString',
      );
    });

    it('all options', () => {
      expect(
        condenseStrings(singleWord, {
          minLength: 40,
          replacement: '*.*',
          startLength: 5,
          endLength: 20,
        }),
      ).toBe('thisi*.*hatshouldbecondensed');

      expect(
        condenseStrings(multiWord, {
          minLength: 40,
          replacement: '*.*',
          startLength: 5,
          endLength: 20,
        }),
      ).toBe(
        'thisisaverylongstringthatshouldbecond ensed*.*hatshouldbecondensed thisIsAshorterString',
      );
    });
  });
});
