import { describe, expect, it } from 'vitest';
import { unwrapData, wrapData } from '../dataWrapper';

// test for dataWrapper function
describe('wrapData function', () => {
  it('should wrap data into an object', () => {
    const data = { a: 1 };
    const wrappedData = wrapData(data, 'test');
    expect(wrappedData).toEqual({ inspect: true, data, name: 'test' });
  });

  it('should wrap data into an object without name', () => {
    const data = { a: 1 };
    const wrappedData = wrapData(data);
    expect(wrappedData).toEqual({ inspect: true, data });
  });

  it('should return a new wrapped object that data is {name:prevWrappedObjectData} if the input is already a wrapped object', () => {
    const data = 1;
    const wrappedData = wrapData(data, 'test');
    const returnWrapped = wrapData(wrappedData, 'newName');
    expect(returnWrapped).toEqual({
      inspect: true,
      data: { test: 1 },
      name: 'newName',
    });
  });
});

describe('unwrapData function', () => {
  it('should return the input if it is not a wrapped object', () => {
    const data = 1;
    const result = unwrapData(data);
    expect(result).toEqual(1);
  });

  it('should return the data of the wrapped object if the input is a wrapped object and name is undefined', () => {
    const data = 1;
    const wrappedData = wrapData(data);
    const result = unwrapData(wrappedData);
    expect(result).toEqual(1);
  });

  it('should return {name: data} if the input is a wrapped object and has a name', () => {
    const data = 1;
    const wrappedData = wrapData(data, 'test');
    const result = unwrapData(wrappedData);
    expect(result).toEqual({ test: 1 });
  });
});
