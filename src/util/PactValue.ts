/**
 * @typedef {object} PactInt - A very big or very small `pact` integer value.
 * Integers greater than the max `number` value (9007199254740991) or less than
 * the min `number` value (-9007199254740991) are stringified and tagged as
 * indicated by the `pact` serialization of integer values:
 * https://github.com/kadena-io/pact/blob/master/src/Pact/Types/Codec.hs#L64
 */
export type PactInt = {
  int: string
};

/**
 * @typedef {object} PactDecimal - A very big or very small `pact` decimal value.
 * Decimals whose mantissa precision is greater than the max `number` value (9007199254740991)
 * or less than the min `number` value (-9007199254740991) are stringified and tagged as
 * indicated by the `pact` serialization of decimal values:
 * https://github.com/kadena-io/pact/blob/master/src/Pact/Types/Codec.hs#L83
 */
export type PactDecimal = {
  decimal: string
};

/** TODO: Should the helper functions `mkPactInt` and `mkPactDecimal` try to enforce the
 * constraints the type definition explains. i.e. Should `isSafeInteger` be used?
 * */

export function mkPactInt(value: string): PactInt {
  return {
    int: value,
  };
}

export function mkPactDecimal(value: string): PactDecimal {
  return {
    decimal: value,
  };
}


/**
 * @typedef {sumtype} PactLiteral - A sum type representing a `pact` literal value.
 * Should have parity with the JSON serialization of the Haskell type `Literal` as defined in `pact`:
 * https://github.com/kadena-io/pact/blob/master/src/Pact/Types/Exp.hs#L95
 * @property {string}
 * @property {number} - JavaScript integer and decimal values.
 *                      Max `number` value is 9007199254740991.
 *                      Min `number` value is -9007199254740991.
 * @property {PactInt} - Integer values that exceed the max and min precision of `number`.
 * @property {PactDecimal} - Decimal values whose mantissa exceed the max and min precision of `number`.
 * @property {boolean}
 * TODO: add `UTCTime` literal.
 */
export type PactLiteral = string | number | PactInt | PactDecimal | boolean;

/**
  * @typedef {sumtype} PactValue - A sum type representing a `pact` value.
  * Should have parity with the JSON serialization of the Haskell type `PactValue` as defined in `pact`:
  * https://github.com/kadena-io/pact/blob/master/src/Pact/Types/PactValue.hs#L109
  * @property {PactLiteral}
  * @property {Array<PactValue>} - Array of pact values (recursive type)
  * TODO: add object map of pact values type.
  * TODO: add guard type of pact values type.
  * TODO: add module reference type type.
  */
export type PactValue = PactLiteral | Array<PactValue>;
