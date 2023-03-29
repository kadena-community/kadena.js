import { convertStyles } from './../convertStyles';
describe('convertStyles', () => {
  it('should return the converted style', () => {
    const data = { test: { md: 1 } };
    const result = convertStyles(data);
    const expectedResult = { '@md': { test: 1 } };

    expect(result).toEqual(expectedResult);
  });

  it('should return the converted style, where md is filled with multiple values', () => {
    const data = { test: { md: 1 }, 'he-man': { md: 2, lg: 3 } };
    const result = convertStyles(data);
    const expectedResult = {
      '@md': { test: 1, 'he-man': 2 },
      '@lg': { 'he-man': 3 },
    };
    console.log(result);
    expect(result).toEqual(expectedResult);
  });

  it('should return the converted style, where primitives are returned as is', () => {
    const data = { test: { md: 1 }, test2: 3 };
    const result = convertStyles(data);
    const expectedResult = {
      '@md': { test: 1 },
      test2: 3,
    };
    console.log(result);
    expect(result).toEqual(expectedResult);
  });
});
