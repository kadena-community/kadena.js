import { describe, expect, it } from 'vitest';
import { uniqMap } from '../uniqMap';

describe('uniqMap', () => {
  it('walks through a simple array', () => {
    const arr = ['one', 'two'];
    const result = uniqMap(arr, (el) => el);
    const expected = ['one', 'two'];
    expect(result).toEqual(expected);
  });

  it('walks through a simple array with duplicates', () => {
    const arr = ['one', 'one', 'two'];
    const result = uniqMap(arr, (el) => el);
    const expected = ['one', 'two'];
    expect(result).toEqual(expected);
  });

  it('walks through a simple array with duplicates with idFn', () => {
    const arr = ['one', 'one', 'two'];
    const result = uniqMap(
      arr,
      (el) => el,
      (el, i) => el + i,
    );
    const expected = ['one', 'one', 'two'];
    expect(result).toEqual(expected);
  });

  it('walks through a array of objects', () => {
    const arr = [{ id: 1 }, { id: 1 }, { id: 1 }];
    const result = uniqMap(arr, (el) => el);
    const expected = [{ id: 1 }, { id: 1 }, { id: 1 }];
    expect(result).toEqual(expected);
  });

  it('walks through a array of objects with idFn', () => {
    const arr = [{ id: 1 }, { id: 1 }, { id: 1 }];
    const result = uniqMap(
      arr,
      (el) => el,
      (el) => el.id,
    );
    const expected = [{ id: 1 }];
    expect(result).toEqual(expected);
  });
});
