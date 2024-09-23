import { prismaClient } from '@db/prisma-client';
import { createClient, createTransaction } from '@kadena/client';
import { composePactCommand } from '@kadena/client/fp';
import { Prisma } from '@prisma/client';
import { dotenv } from '@utils/dotenv';
import { initializeNetworkConfig } from '@utils/network';
import { readdir } from 'fs/promises';
import { Listr } from 'listr2';
import path from 'path';
import { mempoolGetPending } from './chainweb-node/mempool';
import { getNetworkStatistics } from './network';

export class SystemCheckError extends Error {
  public originalError?: Error;

  public constructor(message: string, originalError?: Error) {
    super(message);
    this.originalError = originalError;
  }
}

export async function runSystemsCheck(): Promise<void> {
  console.log('\n');
  try {
    return await new Listr([
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
                title: 'Checking if all the migrations are executed.',
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
                      `Unexecuted migrations detected. If you started graph at the same time as devnet, try restarting graph: ${unexecutedMigrations.join(
                        ', ',
                      )}`,
                    );
                  }
                },
              },
              {
                title: 'Checking if chainweb node is running and reachable.',
                task: async () => {
                  const { apiVersion, networkId } =
                    await initializeNetworkConfig();

                  await createClient(
                    ({ chainId }) =>
                      `${dotenv.NETWORK_HOST}/chainweb/${apiVersion}/${networkId}/chain/${chainId}/pact`,
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
                async task() {
                  try {
                    await mempoolGetPending();
                  } catch (error) {
                    throw new Error('Unable to connect to the mempool.');
                  }
                },
              },
              {
                title: 'Checking for network statistics endpoint.',
                async task() {
                  try {
                    await getNetworkStatistics();
                  } catch (error) {
                    throw new Error('Unable to connect to the mempool.');
                  }
                },
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
  } catch (error) {
    throw new SystemCheckError('System check failed.', error);
  }
}
