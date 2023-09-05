import type { ITransaction } from './types';
import { isUndefinedOrNull } from './util';

/*
 *  A De-duplicating cache that keeps the most recent N (.cacheSpan) elements by some attribute value (.spanValueGetter callback return value)
 *    - for cw-stream-client:
 *      cacheSpan is the window over which we may receive duplicates when reconnecting, e.g. CONFIRMATION_DEPTH + 3
 *      spanValueGetter returns txn => txn.height
 *  - It must support updating elements
 *    - for cw-stream-client: same txn can be received multiple times with different confirmation depths
 *  - An element's identity is returned by identityCheck
 *    - for cw-stream-client: txn => txn.meta.id
 *  - Since elements can be updated, equality between elements with the same identity is returned by equalityCheck callback
 *    - for cw-stream-client: txn => txn.meta.id && txn.meta.confirmations
 *
 *  - call .addCache([txn1, txn2, txn3])
 *    returns bool[] like [shouldUpdate1, shouldUpdate2, shouldUpdate3]
 *      each bool array idx corresponds to the input array element of the same idx
 *      true iff a consumer event should be triggered, i.e. it is all of:
 *        - within the span we are tracking, e.g. height is within [max_height - 12, max_height]
 *        - has not seen before in its exact identity+equality configuration
 *
 *  Note: identity vs equality is used internally to distinguish between "push new element to cache" (no identity match found)
 *  vs "find this item in cache and update it to the latest value (identity match found, did not equal latest version exactly)
 *
 */

type SlidingCacheConfig<TShape extends ITransaction> = Pick<
  SlidingCache<TShape>,
  'spanValueGetter' | 'cacheSpan' | 'identityCheck' | 'equalityCheck'
>;

type SlidingCacheConstructor<TShape extends ITransaction> = Partial<
  SlidingCacheConfig<TShape>
>;

const defaults: SlidingCacheConfig<ITransaction> = {
  spanValueGetter: ({ height }) => height,
  cacheSpan: 3,
  identityCheck: (a, b) => a?.meta?.id === b?.meta?.id,
  equalityCheck: (a, b) =>
    a?.meta?.id === b?.meta?.id &&
    a?.meta?.confirmations === b?.meta?.confirmations,
};

type InSpanRange = boolean;
type Exists = boolean;
type ExistsIdentical = boolean;
type CacheIdx = number;

export default class SlidingCache<TShape extends ITransaction>
  implements SlidingCacheConfig<TShape>
{
  public minSpanValue: number = Infinity;
  public maxSpanValue: number = -Infinity;
  public cache: TShape[] = [];

  public spanValueGetter: (elem: TShape) => number;
  public cacheSpan: number;
  public identityCheck: (a: TShape, b: TShape) => boolean;
  public equalityCheck: (a: TShape, b: TShape) => boolean;

  public constructor(params: SlidingCacheConstructor<TShape> = {}) {
    this.cache = [];
    this.spanValueGetter = params.spanValueGetter ?? defaults.spanValueGetter;
    this.cacheSpan = params.cacheSpan ?? defaults.cacheSpan;
    this.identityCheck = params.identityCheck ?? defaults.identityCheck;
    this.equalityCheck = params.equalityCheck ?? defaults.equalityCheck;
  }

  public addCache(...elems: TShape[]): boolean[] {
    let needUpdate = false;
    let newMaxCacheValue = this.maxSpanValue;

    const retVals = [];
    for (const elem of elems) {
      if (isUndefinedOrNull(elem)) {
        console.error(
          'Sliding cache: Received null or undefined data element. This should not happen!',
        );
        // do not emit this
        retVals.push(false);
        continue;
      }
      const cacheValue = this.spanValueGetter(elem);
      if (cacheValue < this.minSpanValue) {
        needUpdate = true;
        this.minSpanValue = cacheValue;
      }
      if (cacheValue > newMaxCacheValue) {
        needUpdate = true;
        newMaxCacheValue = cacheValue;
      }
      const [inSpanRange, exists, existsIdentical, cacheIdx] =
        this.existsCache(elem);

      if (!inSpanRange) {
        // outside of cache's sliding window, emit. possible duplicate
        retVals.push(true);
      } else {
        if (exists && !existsIdentical) {
          this.cache[cacheIdx] = elem;
        }
        if (!exists) {
          this.cache.push(elem);
        }
        retVals.push(existsIdentical ? false : true);
      }
    }
    if (needUpdate) {
      this._updateCacheMinMax(newMaxCacheValue);
    }
    return retVals;
  }

  public existsCache(
    needle: TShape,
  ): [InSpanRange, Exists, ExistsIdentical, CacheIdx] {
    // [in span range, exists (by id), exists with identical confirmation depth, cache index]
    const spanValue = this.spanValueGetter(needle);
    if (spanValue < this.minSpanValue) {
      return [false, false, false, -1];
    }
    for (let idx = 0; idx < this.cache.length; idx++) {
      const elem = this.cache[idx];
      if (this.equalityCheck(elem, needle)) {
        // exists identically (with same confirmation status)
        return [true, true, true, idx];
      } else if (this.identityCheck(elem, needle)) {
        // exists by id but with different confirmation status
        return [true, true, false, idx];
      }
    }
    return [true, false, false, -1];
  }

  private _updateCacheMinMax(newMax: number): void {
    this.maxSpanValue = newMax;
    const { minSpanValue, maxSpanValue, cacheSpan } = this;
    if (maxSpanValue - minSpanValue > cacheSpan) {
      // we can evict
      this.minSpanValue = maxSpanValue - cacheSpan;
      this._evict();
    }
  }

  private _evict(): number {
    const nextCache = this.cache.filter(
      (elem) => this.spanValueGetter(elem) >= this.minSpanValue,
    );
    const evictedNum = this.cache.length - nextCache.length;
    this.cache = nextCache;
    return evictedNum;
  }
}
