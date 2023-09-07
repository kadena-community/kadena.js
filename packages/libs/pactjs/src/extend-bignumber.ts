import type { IPactDecimal, IPactInt } from '@kadena/types';

// in order to extends BigNumber methods correctly I had to add the PactNumber methods to the prototype of BigNumber
// here we add those methods to the interface as well, then typescript also works
declare module 'bignumber.js' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface BigNumber {
    toInteger(): string;
    toStringifiedInteger(): string;
    toPactInteger(): IPactInt;
    toDecimal(): string;
    toStringifiedDecimal(): string;
    toPactDecimal(): IPactDecimal;
  }
}
