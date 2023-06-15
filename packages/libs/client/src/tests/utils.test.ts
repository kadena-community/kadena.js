import { parseType } from '../utils/parseType'; // Replace with the actual module path

describe('parseType', () => {
  test('should return the decimal value when input is a PactLiteral object with decimal property', () => {
    const arg = { decimal: '10' };
    const result = parseType(arg);
    expect(result).toBe('10.0');
  });

  test('should return the integer value when input is a PactLiteral object with int property', () => {
    const arg = { int: '5' };
    const result = parseType(arg);
    expect(result).toBe('5');
  });

  test('should return the input argument if it is neither an object, number, string, nor function', () => {
    const arg = true;
    const result = parseType(arg);
    expect(result).toBe(true);
  });

  test('should wrap string input in double quotes', () => {
    const arg = 'hello';
    const result = parseType(arg);
    expect(result).toBe('"hello"');
  });

  test('should invoke the function and return its result', () => {
    const arg = (): string => 'dynamic';
    const result = parseType(arg);
    expect(result).toBe('dynamic');
  });

  test('should throw an error if input is a number', () => {
    const arg = 42;
    expect(() => {
      parseType(arg);
    }).toThrow('Type `number` is not allowed');
  });
});
