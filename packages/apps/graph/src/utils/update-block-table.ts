// update blocks table
// add `id` new column
// populate based on `creationtime`
// make @default(autoincrement())

// https://stackoverflow.com/questions/54696729/postgresql-add-serial-column-to-existing-table-with-values-based-on-order-by
// https://stackoverflow.com/questions/16474720/alter-data-type-of-a-column-to-serial

import { prismaClient } from '../db/prismaClient';

async function main(): Promise<void> {
  const services = ['chainweb-mining-client', 'chainweb-node', 'chainweb-data'];

  await Promise.all(services.map(devnetStop)).catch((err) => {
    console.log('error: could not stop devnet');
    return console.error(err);
  });

  const results = await prismaClient.$transaction([
    prismaClient.$executeRawUnsafe(`
      ALTER TABLE public.blocks
      ADD COLUMN IF NOT EXISTS id INT;
    `),

    prismaClient.$executeRawUnsafe(`
      UPDATE public.blocks
      SET id = COALESCE(id, b.rownum)
      FROM (SELECT hash, row_number()
        OVER (ORDER BY creationtime) AS rownum
        FROM public.blocks) b
      WHERE public.blocks.hash = b.hash
      AND public.blocks.id IS NULL;
    `),

    prismaClient.$executeRawUnsafe(`
      ALTER TABLE public.blocks
      ALTER COLUMN id
      SET NOT NULL;
    `),

    prismaClient.$executeRawUnsafe(`
      ALTER TABLE public.blocks
      ADD CONSTRAINT blocks_id_uniq UNIQUE (id);
    `),

    prismaClient.$executeRawUnsafe(`
      CREATE SEQUENCE IF NOT EXISTS public.blocks_id_seq
      OWNED BY public.blocks.id;
    `),

    prismaClient.$executeRawUnsafe(`
      SELECT setval(
        'public.blocks_id_seq',
        COALESCE(MAX(public.blocks.id), 0) + 1,
        false)
      FROM public.blocks;
    `),

    prismaClient.$executeRawUnsafe(`
      ALTER TABLE public.blocks
      ALTER COLUMN id
      SET DEFAULT nextval('public.blocks_id_seq');
    `),
  ]);

  results.forEach((r: unknown) => console.log('affected rows', r));

  await Promise.all(services.map(devnetStart)).catch((err) => {
    console.log("error: couldn't stop devnet");
    return console.error(err);
  });
}

main()
  .catch((...err) =>
    console.error(
      ...err,
      '\n\nAn error occurred. You can always drop the id column and try again.',
    ),
  )
  .finally(() => prismaClient.$disconnect());

function devnetStop(value: string): Promise<Response> {
  return fetch(`http://localhost:9999/stop/${value}`, {
    method: 'PATCH',
  });
}

function devnetStart(value: string): Promise<Response> {
  return fetch(`http://localhost:9999/start/${value}`, {
    method: 'POST',
  });
}
