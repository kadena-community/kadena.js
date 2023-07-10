import { IPactDecimal, IPactInt } from '@kadena/types';

import BigNumber from 'bignumber.js';

/**
 * Constructs a bignumber.js instance and formats into Pact number formats.
 *
 * @alpha
 */
export class PactNumber {
  private readonly _number: BigNumber;

  public constructor(value: string | number) {
    if (isNaN(Number(value))) throw new Error('Value is NaN');
    this._number = new BigNumber(value);
  }

  public toInteger(): string {
    if (!this._number.isInteger()) {
      throw new Error('PactNumber is not an integer');
    }
    return this._number.toString();
  }

  public toStringifiedInteger(): string {
    return JSON.stringify(this.toInteger());
  }

  public toPactInteger(): IPactInt {
    if (!this._number.isInteger()) {
      throw new Error('PactNumber is not an integer');
    }
    return {
      int: this.toInteger(),
    };
  }

  public toDecimal(): string {
    if (this._number.isInteger()) {
      return `${this._number.toString()}.0`;
    }
    return `${this._number.toString()}`;
  }

  public toStringifiedDecimal(): string {
    return JSON.stringify(this.toDecimal());
  }

  public toPactDecimal(): IPactDecimal {
    return {
      decimal: this.toDecimal(),
    };
  }
}
