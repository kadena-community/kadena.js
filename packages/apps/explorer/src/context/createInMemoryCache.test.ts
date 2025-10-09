import { InMemoryCache } from '@apollo/client';
import { describe, expect, it } from 'vitest';
import { createInMemoryCache } from './createInMemoryCache';

describe('createInMemoryCache', () => {
  it('should return an instance of InMemoryCache', () => {
    const cache = createInMemoryCache();
    expect(cache).toBeInstanceOf(InMemoryCache);
  });

  it('should set typePolicies for Block and Transaction with keyFields hash', () => {
    const cache = createInMemoryCache();
    // Access private field for test purposes
    // @ts-ignore
    const typePolicies = cache.config?.typePolicies;
    expect(typePolicies).toBeDefined();
    if (typePolicies) {
      expect(typePolicies.Block).toEqual({ keyFields: ['hash'] });
      expect(typePolicies.Transaction).toEqual({ keyFields: ['hash'] });
    }
  });
});
