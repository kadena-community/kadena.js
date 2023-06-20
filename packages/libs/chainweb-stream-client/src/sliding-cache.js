// cacheField: .height
// cacheSpan: $CHAIN_SPAN
// idField: .meta.id
// equalityCheck: (a, b) => a.meta.id === b.meta.id && a.meta.confirmations === b.meta.confirmations

const defaults = {
  cacheGetter: ({ meta: { confirmations }}) => confirmations,
  cacheSpan: 3,
  identityCheck: (a, b) => a.meta?.id === b.meta?.id,
  equalityCheck: (a, b) => a.meta?.id === b.meta?.id && a.meta?.confirmations === b.meta?.confirmations,
};

class LimitedCache {
  minCacheValue = Infinity;
  maxCacheValue = -Infinity;

  constructor(params) {
    const effectiveParams = {
      ...defaults,
      ...params,
    };
    for(const [key, value] of Object.entries(effectiveParams)) {
      this[key] = value;
    }
    this.cache = [];
  }

  addCache(...elems) {
    let needUpdate = false;
    let newMaxCacheValue = this.maxCacheValue;

    let minTracked;
    const calcMinTracked = () => minTracked = newMaxCacheValue - this.cacheSpan;
    calcMinTracked();

    const retVals = [];
    for(const elem of elems) {
      const cacheValue = this.cacheGetter(elem);
      if (cacheValue >= minTracked) {
        // TODO upsert
        if (cacheValue < this.minCacheValue) {
          needUpdate = true;
          this.minCacheValue = cacheValue;
        }
        if (cacheValue > newMaxCacheValue) {
          needUpdate = true;
          newMaxCacheValue = cacheValue;
          calcMinTracked();
        }
        const [exists, existsIdentical, cacheIdx] = this.existsCache(elem);
        if (exists && !existsIdentical) {
          this.cache[cacheIdx] = elem;
        }
        if (!exists) {
          this.cache.push(elem);
        }
        if (elem.meta.id === "a5") {
          debugger;
        }
        retVals.push(existsIdentical ? false : true);
      } else {
        console.warn(`Ignoring cacheValue=${cacheValue}, minimum tracked is ${minTracked}`);
        retVal.push(false);
      }
    }
    if (needUpdate) {
      this.updateCacheMinMax(newMaxCacheValue);
    }
    return retVals;
  }

  existsCache(needle) { // [exists, identical, index]
    let idx = 0;
    for(let idx = 0; idx < this.cache.length; idx++ ) {
      const elem = this.cache[idx];
      // exists identically (with same confirmation status)
      if (this.equalityCheck(elem, needle)) {
        return [true, true, idx];
      // exists by id but with different confirmation status
      } else if (this.identityCheck(elem, needle)) {
        return [true, false, idx];
      }
    }
    return [false, false, -1];
  }

  updateCacheMinMax(newMax) {
    debugger;
    this.maxCacheValue = newMax;
    const { minCacheValue, maxCacheValue, cacheSpan } = this;
    if (maxCacheValue - minCacheValue > cacheSpan) {
      // we can evict
      this.minCacheValue = maxCacheValue - cacheSpan;
      this.evict();
    }
  }

  evict() {
    const nextCache = this.cache.filter(elem => this.cacheGetter(elem) >= this.minCacheValue);
    const evictedNum = this.cache.length - nextCache.length;
    console.log(`Evicted ${evictedNum}`);
    this.cache = nextCache;
    return evictedNum;
  }
}

const l = new LimitedCache();

const inputs = [
  { meta: { id: 'a1', confirmations: 1 }, height: 1 },
  { meta: { id: 'a2', confirmations: 1 }, height: 1 },
  { meta: { id: 'a3', confirmations: 1 }, height: 2 },
  { meta: { id: 'a4', confirmations: 1 }, height: 3 },
  { meta: { id: 'a1', confirmations: 2 }, height: 3 },
  { meta: { id: 'a7', confirmations: 1 }, height: 4 },
  { meta: { id: 'a2', confirmations: 1 }, height: 1 },
  { meta: { id: 'a1', confirmations: 3 }, height: 6 },
  { meta: { id: 'a5', confirmations: 3 }, height: 1 },
];

const outputs = l.addCache(...inputs);

for(let i=0; i<outputs.length; i++) {
  console.log(i, outputs[i], inputs[i]);
}

debugger;
