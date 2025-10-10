import { describe, expect, it } from 'vitest';
import { cleanupOrigin, getOriginKey } from '../getOriginKey';

describe('getOriginKey', () => {
  it('should return undefined for undefined or null input', () => {
    expect(getOriginKey(undefined)).toBeUndefined();
    expect(getOriginKey(null)).toBeUndefined();
  });

  it('should normalize and remove special characters from a URL', () => {
    expect(getOriginKey('https://he-man.com')).toBe('httpshemancom');
    expect(getOriginKey('http://masters-of-the-universe.org')).toBe(
      'httpmastersoftheuniverseorg',
    );
    expect(getOriginKey('https://skeletor.com')).toBe('httpsskeletorcom');
    expect(getOriginKey('https://orko.com:8080')).toBe('httpsorkocom8080');
    expect(getOriginKey('https://he-man.com/path?query=1')).toBe(
      'httpshemancompathquery1',
    );
  });
});

describe('cleanupOrigin', () => {
  it('should remove trailing slash from the origin', () => {
    expect(cleanupOrigin('https://he-man.com')).toBe('https://he-man.com');
    expect(cleanupOrigin('http://masters-of-the-universe.org/')).toBe(
      'http://masters-of-the-universe.org',
    );
  });
  it('should convert the origin to lowercase', () => {
    expect(cleanupOrigin('HTTPS://skeleTor.Com/')).toBe('https://skeletor.com');
  });
});
