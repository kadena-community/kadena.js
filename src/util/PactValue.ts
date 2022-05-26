/**
 * @typedef {sumtype} PactLiteral - A sum type representing a `pact` literal value.
 * Should have parity with the JSON serialization of the Haskell type `Literal` as defined in `pact`:
 * https://github.com/kadena-io/pact/blob/master/src/Pact/Types/Exp.hs#L95
 * @property {string}
 * @property {number} - JavaScript integer and decimal values.
 *                      Max `number` value is 9007199254740991.
 *                      Min `number` value is -9007199254740991.
 * @property {boolean}
 * TODO: Should `isSafeInteger` be used?
 * TODO: add `UTCTime` literal.
 * TODO: add object representation of Integer.
 * TODO: add object representation of Decimal.
 */
export type PactLiteral = string | number | boolean;

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
