import type { IPactDecimal, IPactInt } from '@kadena/types';
import BigNumber from 'bignumber.js';

// Configure BigNumber to prevent exponential notation (Scientific notation) for numbers.
// The library supports a maximum of 1e9 digits, which I believe is sufficient for our use case.
// It is highly unlikely that someone would pass a number with more than 1,000,000,000 digits.
BigNumber.config({ EXPONENTIAL_AT: [-1e9, 1e9] });

interface IExtendedBigNumber {
    toInteger(): string;
    toStringifiedInteger(): string;
    toPactInteger(): IPactInt;
    toDecimal(): string;
    toStringifiedDecimal(): string;
    toPactDecimal(): IPactDecimal;
  }


type OverrideMethods<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => BigNumber
  ? (...args: A) => PactNumber
  : T[K] extends BigNumber
  ? PactNumber
  : T[K];
};

const ExtendedBigNumber:  (new (...args: unknown[]) => OverrideMethods<typeof BigNumber & IExtendedBigNumber>) = BigNumber as any

// In order to extend BigNumber methods correctly, I had to add the PactNumber methods to
// the prototype of BigNumber. Then, something like this works:
// const decimal = new PactNumber('0.9').plus("1").toPactDecimal()
// The reason is that plus (and the other methods) return a new instance of BigNumber, not PactNumber.
// By adding the PactNumber methods to the prototype of BigNumber, this will work as expected.
ExtendedBigNumber.prototype.toInteger = function toInteger() {
  if (!this.isInteger()) {
    throw new Error('PactNumber is not an integer');
  }
  return this.toString();
};

ExtendedBigNumber.prototype.toStringifiedInteger = function toStringifiedInteger() {
  return JSON.stringify(this.toInteger());
};

ExtendedBigNumber.prototype.toPactInteger = function toPactInteger() {
  if (!this.isInteger()) {
    throw new Error('PactNumber is not an integer');
  }
  return {
    int: this.toInteger(),
  };
};

ExtendedBigNumber.prototype.toDecimal = function toDecimal() {
  if (this.isInteger()) {
    return `${this.toString()}.0`;
  }
  return `${this.toString()}`;
};

ExtendedBigNumber.prototype.toStringifiedDecimal = function toStringifiedDecimal() {
  return JSON.stringify(this.toDecimal());
};

ExtendedBigNumber.prototype.toPactDecimal = function toPactDecimal() {
  return {
    decimal: this.toDecimal(),
  };
};



/**
 * Constructs a bignumber.js instance and formats into Pact number formats.
 *
 * @alpha
 */
export class PactNumber extends ExtendedBigNumber {
  public constructor(
    value: string | number | { int: string } | { decimal: string },
  ) {
    let num;
    if (typeof value === 'object') {
      if ('int' in value) {
        num = value.int;
      } else if ('decimal' in value) {
        num = value.decimal;
      } else {
        throw new Error('Invalid PactNumber object');
      }
    } else {
      num = value;
    }
    super(num);
    if (isNaN(Number(num))) throw new Error('Value is NaN');
  }

}



