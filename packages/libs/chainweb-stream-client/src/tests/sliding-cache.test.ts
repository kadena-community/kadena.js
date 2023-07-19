import SlidingCache from '../sliding-cache';
import { IAccountTransaction } from '../types';

function makeTestObject(
  height: number,
  id: string,
  confirmations: number,
): IAccountTransaction {
  return {
    height,
    meta: {
      id,
      confirmations,
    },
    amount: '1',
    token: 'a',
    fromAccount: 'a',
    toAccount: 'a',
    crossChainId: null,
    crossChainAccount: null,
    blockTime: 'a',
    blockHash: 'a',
    requestKey: 'a',
    idx: 2,
    chain: 2,
  };
}

describe('SlidingCache', () => {
  const CACHE_SPAN = 5;

  const SPAN_VALUE_GETTER = ({ height }: IAccountTransaction): number => height;

  const IDENTITY_CHECK = (
    { meta: { id: idA } }: IAccountTransaction,
    { meta: { id: idB } }: IAccountTransaction,
  ): boolean => idA === idB;

  const EQUALITY_CHECK = (
    { meta: { id: idA, confirmations: confA } }: IAccountTransaction,
    { meta: { id: idB, confirmations: confB } }: IAccountTransaction,
  ): boolean => idA === idB && confA === confB;

  let slidingCache: SlidingCache<IAccountTransaction> | undefined;

  beforeEach(() => {
    slidingCache = new SlidingCache<IAccountTransaction>({
      cacheSpan: CACHE_SPAN,
      spanValueGetter: SPAN_VALUE_GETTER,
      identityCheck: IDENTITY_CHECK,
      equalityCheck: EQUALITY_CHECK,
    });
  });

  it('constructor should set the provided arguments correctly', () => {
    expect(slidingCache!.cacheSpan).toBe(CACHE_SPAN);
    expect(slidingCache!.spanValueGetter).toBe(SPAN_VALUE_GETTER);
    expect(slidingCache!.identityCheck).toBe(IDENTITY_CHECK);
    expect(slidingCache!.equalityCheck).toBe(EQUALITY_CHECK);
  });

  it('addCache should set the min and max span values correctly', () => {
    slidingCache!.addCache(makeTestObject(10, 'a', 1));
    expect(slidingCache!.minSpanValue).toBe(10);
    expect(slidingCache!.maxSpanValue).toBe(10);
    slidingCache!.addCache(makeTestObject(12, 'a', 1));
    expect(slidingCache!.maxSpanValue).toBe(12);
  });

  it('addCache should set the min span value to be max minus cache_span', () => {
    slidingCache!.addCache(makeTestObject(10, 'a', 1));
    expect(slidingCache!.minSpanValue).toBe(10);
    slidingCache!.addCache(makeTestObject(16, 'a', 1));
    expect(slidingCache!.minSpanValue).toBe(16 - CACHE_SPAN);
  });

  it('addCache should return an array of boolean for each addCache arg provided', () => {
    const txn = makeTestObject(10, 'a', 1);
    const txn2 = makeTestObject(12, 'b', 2);

    const shouldEmit = slidingCache!.addCache(txn, txn2);

    expect(shouldEmit.length).toBe(2);
    expect(shouldEmit[0]).toBe(true);
    expect(shouldEmit[1]).toBe(true);
  });

  it('addCache should not emit the same identical txn the second time it is added', () => {
    const txn = makeTestObject(10, 'a', 1);

    const [shouldEmit] = slidingCache!.addCache(txn);
    const [shouldNotEmit] = slidingCache!.addCache(txn);

    expect(shouldEmit).toBe(true);
    expect(shouldNotEmit).toBe(false);
    expect(slidingCache!.cache.length).toBe(1);
  });

  it('addCache should handle updates to the same txn correctly', () => {
    const txn = makeTestObject(10, 'a', 1);
    const txn2 = makeTestObject(10, 'a', 2);

    const [shouldEmit] = slidingCache!.addCache(txn);
    const [shouldEmit2] = slidingCache!.addCache(txn2);

    expect(shouldEmit).toBe(true);
    expect(shouldEmit2).toBe(true);
    expect(slidingCache!.cache.length).toBe(1);
  });

  it('addCache should evict txns outside of the cache span', () => {
    const txn = makeTestObject(10, 'a', 1);
    const txn2 = makeTestObject(20, 'b', 11);

    const [shouldEmit] = slidingCache!.addCache(txn);
    const [shouldEmit2] = slidingCache!.addCache(txn2);

    expect(shouldEmit).toBe(true);
    expect(shouldEmit2).toBe(true);
    expect(slidingCache!.cache.length).toBe(1);
  });

  it('addCache should return true when an item is outside of cache span range', () => {
    const txn = makeTestObject(10, 'a', 1);
    const txn2 = makeTestObject(1, 'b', 2); // outside of span range

    const [shouldEmit, shouldEmit2] = slidingCache!.addCache(txn, txn2);

    expect(shouldEmit).toBe(true);
    expect(shouldEmit2).toBe(true);
    expect(slidingCache!.cache.length).toBe(1);
  });

  it('existsCache should identify items outside of cache span range', () => {
    const txn = makeTestObject(10, 'a', 1);
    const txn2 = makeTestObject(1, 'b', 2);

    slidingCache!.addCache(txn, txn2);

    const [inSpanRange, exists, existsIdentical, cacheIdx] =
      slidingCache!.existsCache(txn);
    const [inSpanRange2, exists2, existsIdentical2, cacheIdx2] =
      slidingCache!.existsCache(txn2);

    expect(inSpanRange).toBe(true);
    expect(exists).toBe(true);
    expect(existsIdentical).toBe(true);
    expect(cacheIdx).toBe(0);

    expect(inSpanRange2).toBe(false);
    expect(exists2).toBe(false);
    expect(existsIdentical2).toBe(false);
    expect(cacheIdx2).toBe(-1);
  });

  it('existsCache should locate items in cache (in range, exists identical)', () => {
    const txn = makeTestObject(10, 'a', 1);
    const txn2 = makeTestObject(12, 'b', 2);

    slidingCache!.addCache(txn);
    slidingCache!.addCache(txn2);

    const [inSpanRange, exists, existsIdentical, cacheIdx] =
      slidingCache!.existsCache(txn);
    const [inSpanRange2, exists2, existsIdentical2, cacheIdx2] =
      slidingCache!.existsCache(txn2);

    expect(inSpanRange).toBe(true);
    expect(exists).toBe(true);
    expect(existsIdentical).toBe(true);
    expect(cacheIdx).toBe(0);

    expect(inSpanRange2).toBe(true);
    expect(exists2).toBe(true);
    expect(existsIdentical2).toBe(true);
    expect(cacheIdx2).toBe(1);
  });

  it('existsCache should locate items in cache (in range, exists non-identically)', () => {
    const txn = makeTestObject(10, 'a', 1);
    const txn2 = makeTestObject(10, 'a', 2);

    slidingCache!.addCache(txn);

    const [inSpanRange2, exists2, existsIdentical2, cacheIdx2] =
      slidingCache!.existsCache(txn2);

    expect(inSpanRange2).toBe(true);
    expect(exists2).toBe(true);
    expect(existsIdentical2).toBe(false);
    expect(cacheIdx2).toBe(0);
  });

  it('existsCache should return false for items not in cache (in range)', () => {
    const txn = makeTestObject(10, 'a', 1);
    const txn2 = makeTestObject(10, 'b', 2);

    slidingCache!.addCache(txn);

    const [inSpanRange2, exists2, existsIdentical2, cacheIdx2] =
      slidingCache!.existsCache(txn2);

    expect(inSpanRange2).toBe(true);
    expect(exists2).toBe(false);
    expect(existsIdentical2).toBe(false);
    expect(cacheIdx2).toBe(-1);
  });
});
