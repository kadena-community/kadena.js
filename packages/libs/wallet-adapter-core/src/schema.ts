import type { StandardSchemaV1 } from '@standard-schema/spec';
import { object, optional, string } from 'valibot';

export const defaultConnectSchema = object({
  networkId: optional(string()),
});

/**
 * A schema error with useful information.
 * source https://github.com/standard-schema/standard-schema/blob/main/packages/utils/src/SchemaError/SchemaError.ts
 */
export class SchemaError extends Error {
  /**
   * The schema issues.
   */
  public readonly issues: ReadonlyArray<StandardSchemaV1.Issue>;

  /**
   * Creates a schema error with useful information.
   *
   * @param issues The schema issues.
   */
  public constructor(issues: ReadonlyArray<StandardSchemaV1.Issue>) {
    super(issues[0].message);
    this.name = 'SchemaError';
    this.issues = issues;
  }
}
