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

  test('getting # when correct pathname is provided with incorrect href from the item', () => {
    const pathname = '/';
    const result = getHref(pathname, 'non-existent');
    expect(result).toBe('#');
  });

  test('none existing base path', () => {
    const pathname = '/non-existent';
    const result = getHref(pathname, 'whatever');
    expect(result).toBe('#');
  });

  test('none existent item href', () => {
    const pathname = '/faucet/non-existent';
    const result = getHref(pathname, 'faucet');
    expect(result).toBe('/faucet/new');
  });

  test('existing basepath and existing href', () => {
    const pathname = '/faucet/new';
    const result = getHref(pathname, 'faucet');
    expect(result).toBe('/faucet/new');
  });
});
