import { describe, expect, test } from 'vitest';
import { getHref } from '../getHref';

describe('getHref', () => {
  test('getting # when no correct pathname is provided and there is no href from the item', () => {
    const result = getHref('');
    expect(result).toBe('#');
  });

  test('getting href of first item when there is no path from URL', () => {
    const pathname = '/';
    const result = getHref(pathname, 'faucet');
    expect(result).toBe('/faucet/new');
  });
});
