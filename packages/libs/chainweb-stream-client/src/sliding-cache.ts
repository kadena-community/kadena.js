import { ITransaction } from './types';

// cacheField: .height
// cacheSpan: $CHAIN_SPAN
// idField: .meta.id
// equalityCheck: (a, b) => a.meta.id === b.meta.id && a.meta.confirmations === b.meta.confirmations

type SlidingCacheConfig<Shape extends ITransaction> = Pick<SlidingCache<Shape>, 'cacheGetter' | 'cacheSpan' | 'identityCheck' | 'equalityCheck'>;

type SlidingCacheConstructor<Shape extends ITransaction> = Partial<SlidingCacheConfig<Shape>>;

const defaults: SlidingCacheConfig<ITransaction> = {
  cacheGetter: ({ meta: { confirmations }}) => confirmations,
  cacheSpan: 3,
  identityCheck: (a, b) => a.meta?.id === b.meta?.id,
  equalityCheck: (a, b) => a.meta?.id === b.meta?.id && a.meta?.confirmations === b.meta?.confirmations,
};

export default class SlidingCache<Shape extends ITransaction> implements SlidingCacheConfig<Shape> {
  minCacheValue = Infinity;
  maxCacheValue = -Infinity;
  cache: Shape[] = [];

  cacheGetter: (elem: Shape) => number;
  cacheSpan: number;
  identityCheck: (a: Shape, b: Shape) => boolean;
  equalityCheck: (a: Shape, b: Shape) => boolean;

  constructor(params: SlidingCacheConstructor<Shape> = {}) {
    this.cache = [];
    this.cacheGetter = params.cacheGetter ?? defaults.cacheGetter;
    this.cacheSpan = params.cacheSpan ?? defaults.cacheSpan;
    this.identityCheck = params.identityCheck ?? defaults.identityCheck;
    this.equalityCheck = params.equalityCheck ?? defaults.equalityCheck;
  }

  addCache(...elems: Shape[]) {
    let needUpdate = false;
    let newMaxCacheValue = this.maxCacheValue;

    let minTracked = newMaxCacheValue - this.cacheSpan;
    const recalcMinTracked = () => minTracked = newMaxCacheValue - this.cacheSpan;
    recalcMinTracked();

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
          recalcMinTracked();
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
        // console.warn(`Ignoring cacheValue=${cacheValue}, minimum tracked is ${minTracked}`);
        retVals.push(false);
      }
    }
    if (needUpdate) {
      this.updateCacheMinMax(newMaxCacheValue);
    }
    return retVals;
  }

  existsCache(needle: Shape): [boolean, boolean, number] { // [exists, identical, index]
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

  updateCacheMinMax(newMax: number) {
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

const l = new SlidingCache();

const inputs = [
  { meta: { id: 'a1', confirmations: 1 }, height: 1, ...makeTransactionMock() },
  { meta: { id: 'a2', confirmations: 1 }, height: 1, ...makeTransactionMock() },
  { meta: { id: 'a3', confirmations: 1 }, height: 2, ...makeTransactionMock() },
  { meta: { id: 'a4', confirmations: 1 }, height: 3, ...makeTransactionMock() },
  { meta: { id: 'a1', confirmations: 2 }, height: 3, ...makeTransactionMock() },
  { meta: { id: 'a7', confirmations: 1 }, height: 4, ...makeTransactionMock() },
  { meta: { id: 'a2', confirmations: 1 }, height: 1, ...makeTransactionMock() },
  { meta: { id: 'a1', confirmations: 3 }, height: 6, ...makeTransactionMock() },
  { meta: { id: 'a5', confirmations: 3 }, height: 1, ...makeTransactionMock() },
];

const outputs = l.addCache(...inputs);

for(let i=0; i<outputs.length; i++) {
  console.log(i, outputs[i], inputs[i]);
}

function makeTransactionMock() {
  return {
    blockTime: 'Test Time',
    blockHash: 'Block Hash',
    requestKey: 'Request Key',
    idx: 25,
    chain: 25,
    params: [],
    name: 'Event Name',
    moduleHash: 'Module Hash'
  }
}
