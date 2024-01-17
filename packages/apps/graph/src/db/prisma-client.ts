import type { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { dotenv } from '@utils/dotenv';
import { highlight } from 'cli-highlight';
import fs from 'fs';

export const prismaClient = new PrismaClient({
  ...(dotenv.PRISMA_LOGGING_ENABLED && {
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'stdout',
        level: 'error',
      },
      {
        emit: 'stdout',
        level: 'info',
      },
      {
        emit: 'stdout',
        level: 'warn',
      },
    ],
  }),
  datasources: {
    db: {
      url: dotenv.DATABASE_URL,
    },
  },
});

if (dotenv.PRISMA_LOGGING_ENABLED) {
  prismaClient.$on('query' as never, (e: Prisma.QueryEvent) => {
    console.log('\n   Query:', highlight(e.query));
    console.log('   Params:', highlight(e.params));
    console.log('   Duration:', `${e.duration}ms`);

    if (dotenv.PRISMA_LOG_TO_FILE) {
      fs.appendFileSync(
        dotenv.PRISMA_LOG_FILENAME,
        `${JSON.stringify(e, null, 2)},\n`,
      );
    }
  });
}
