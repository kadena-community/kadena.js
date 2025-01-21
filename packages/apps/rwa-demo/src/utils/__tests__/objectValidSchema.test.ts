import { objectValidSchema } from '../objectValidSchema';

describe('objectValidSchema utils', () => {
  describe('objectValidSchema', () => {
    it('should return false when the schema is has 1 invalid prop', () => {
      const schema = { alias: 'string', account: 'string' };
      const obj = {
        alias: 'heman',
        falseName: 'k:1',
      };

      const result = objectValidSchema(schema)(obj);

      expect(result).toEqual(false);
    });

    it('should return true when the schema is correct', () => {
      const schema = { alias: 'string', account: 'string' };
      const obj = {
        alias: 'heman',
        account: 'k:1',
      };

      const result = objectValidSchema(schema)(obj);

      expect(result).toEqual(true);
    });
  });
});
