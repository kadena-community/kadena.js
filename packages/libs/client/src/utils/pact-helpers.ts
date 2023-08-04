/**
 * Helper function that returns `(read-keyset "<key")` Pact expression
 * @public
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const readKeyset = (key: string) => () => `(read-keyset "${key}")`;

/**
 * the class for adding values to the final pact object without adding quotes to strings
 * @public
 */
export class Literal {
  private _value: string;

  public constructor(value: string) {
    this._value = value;
  }

  public getValue(): string {
    return this._value;
  }

  public toJSON(): string {
    return `Literal(${this._value})`;
  }

  public toString(): string {
    return this.getValue();
  }
}

/**
 * Will create a literal pact expression without surrounding quotes `"`
 * @example
 * ```
 * // use literal as function input
 * Pact.module.["free.crowdfund"]["create-project"](
 *   "project_id",
 *   "project_name",
 *   // this is a reference to another module and should not have quotes in the created expression
 *   literal("coin"),
 *   ...
 * )
 *
 * // use literal as a property of a json in the input
 * Pact.module.["my-contract"]["set-details"](
 *   "name",
 *   "data" : {
 *      age : 35,
 *      tokens : [literal("coin"), literal("kdx")]
 *   }
 * )
 * ```
 * @public
 */
export const literal = (value: string): Literal => {
  return new Literal(value);
};

/**
 * unpack all of the Literal(string) to string
 * @internal
 */
export function unpackLiterals(value: string): string {
  return value.replace(/"Literal\(([^\)]*)\)"/gi, (__, literal) => literal);
}
