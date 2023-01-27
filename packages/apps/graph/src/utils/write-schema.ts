import { builder } from '../graph/builder';

import { writeFileSync } from 'fs';
import { lexicographicSortSchema, printSchema } from 'graphql';
import { join } from 'path';

export const writeSchema = (): void => {
  const schema = builder.toSchema();
  const schemaAsString = printSchema(lexicographicSortSchema(schema));

  writeFileSync(
    join(__dirname, '../../generated-schema.graphql'),
    schemaAsString,
  );
};
