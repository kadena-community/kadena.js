import { prismaClient } from '@db/prisma-client';
import { createClient, createTransaction } from '@kadena/client';
import { composePactCommand } from '@kadena/client/fp';
import { Prisma } from '@prisma/client';
import { dotenv } from '@utils/dotenv';
import { readdir } from 'fs/promises';
import { Listr } from 'listr2';
import path from 'path';

export async function runSystemsCheck() {
  console.log('\n');
  return new Listr([
    {
      title: 'Running system checks.',
      task: (__ctx, task) =>
        task.newListr(
          [
            {
              title: 'Checking if the database is reachable.',
              task: async () => {
                await prismaClient.$queryRaw(Prisma.sql`SELECT 1`);
              },
            },
            {
              title: 'Checking if all the migrations have been run.',
              task: async () => {
                const migrationsDir = path.join(
                  process.cwd(),
                  'cwd-extra-migrations',
                );
                const fileNames = await readdir(migrationsDir);

                const dbMigrationNames = (
                  await prismaClient.$queryRaw<{ filename: string }[]>(
                    Prisma.sql`SELECT filename FROM schema_migrations`,
                  )
                ).map((migration) => migration.filename);

                const unexecutedMigrations = fileNames.filter(
                  (fileName) => !dbMigrationNames.includes(fileName),
                );

                if (unexecutedMigrations.length > 0) {
                  throw new Error(
                    `Unexecuted migrations detected: ${unexecutedMigrations.join(
                      ', ',
                    )}`,
                  );
                }
              },
            },
            {
              title: 'Checking if chainweb node is running and reachable.',
              task: async () => {
                await createClient(
                  ({ chainId }) =>
                    `${dotenv.NETWORK_HOST}/chainweb/0.0/${dotenv.NETWORK_ID}/chain/${chainId}/pact`,
                ).local(
                  createTransaction(
                    composePactCommand(
                      {
                        payload: {
                          exec: {
                            code: '()',
                            data: {},
                          },
                        },
                      },
                      { meta: { chainId: '0' } },
                    )(),
                  ),
                  {
                    preflight: false,
                    signatureVerification: false,
                  },
                );
              },
            },
            {
              title: 'Checking if the mempool is reachable.',
              skip: () =>
                'Skipping: There is currently no mempool implementation.',
              task: async () => {},
            },
          ],
          {
            rendererOptions: {
              collapseSubtasks: false,
              collapseErrors: false,
              collapseSkips: false,
            },
          },
        ),
    },
  ]).run();
}
