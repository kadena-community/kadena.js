import { writeFileSync } from 'fs';
import { lexicographicSortSchema, printSchema } from 'graphql';
import { join } from 'path';
import { builder } from '../graph/builder';

export const writeSchema = (): void => {
  const schema = builder.toSchema();
  const schemaAsString = printSchema(lexicographicSortSchema(schema));

  console.log('Writing schema to generated-schema.graphql');
  writeFileSync(
    join(__dirname, '../../generated-schema.graphql'),
    schemaAsString,
  );
};
