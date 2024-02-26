/**
 * A very big or very small `pact` integer value.
 * Integers greater than the max `number` value (9007199254740991) or less than
 * the min `number` value (-9007199254740991) are stringified and tagged as
 * indicated by the `pact` serialization of integer values:
 * https://github.com/kadena-io/pact/blob/master/src/Pact/Types/Codec.hs#L64
 * @alpha
 */
export interface IPactInt {
  int: string;
}

/**
 * A very big or very small `pact` decimal value.
 * Decimals whose mantissa precision is greater than the max `number` value (9007199254740991)
 * or less than the min `number` value (-9007199254740991) are stringified and tagged as
 * indicated by the `pact` serialization of decimal values:
 * https://github.com/kadena-io/pact/blob/master/src/Pact/Types/Codec.hs#L83
 * @alpha
 */
export interface IPactDecimal {
  decimal: string;
}

/**
 * A sum type representing a `pact` literal value.
 * Should have parity with the JSON serialization of the Haskell type `Literal` as defined in `pact`:
 * https://github.com/kadena-io/pact/blob/master/src/Pact/Types/Exp.hs#L95
 * string
 *
 * `number` - JavaScript integer and decimal values.
 *                      Max `number` value is 9007199254740991.
 *                      Min `number` value is -9007199254740991.
 *
 * `PactInt` - Integer values that exceed the max and min precision of `number`.
 *
 * `PactDecimal` - Decimal values whose mantissa exceed the max and min precision of `number`.
 *
 * `boolean`
 *
 * TODO: add `UTCTime` literal.
 * @alpha
 */
export type PactLiteral =
  | string
  | number
  | IPactInt
  | IPactDecimal
  | boolean
  | Date;

/**
 * A sum type representing a `pact` value.
 * Should have parity with the JSON serialization of the Haskell type `PactValue` as defined in `pact`:
 * https://github.com/kadena-io/pact/blob/master/src/Pact/Types/PactValue.hs#L109
 *
 * `PactLiteral` - any `PactLiteral`
 *
 * `Array<PactValue>` - Array of pact values (recursive type)
 *
 * TODO: add object map of pact values type.
 * TODO: add guard type of pact values type.
 * TODO: add module reference type type.
 * @alpha
 */
export type PactValue = PactLiteral | Array<PactValue> | Record<string, any>;
