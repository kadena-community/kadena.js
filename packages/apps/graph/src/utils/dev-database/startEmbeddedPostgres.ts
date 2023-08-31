import { prismaClient } from '../../db/prismaClient';
import { dotenv } from '../dotenv';

import { embeddedPostgres } from './embeddedPostgres';
import { execShellCommand } from './execShellCommand';
import { processLines } from './process-lines';

import { join } from 'path';
import { stdout } from 'process';

const REGEX_STATEMENT_INSERT_INTO: RegExp =
  /"statement: INSERT INTO.*?(?<!")",/;
const REGEX_STATEMENT_BEGIN: RegExp = /"statement: BEGIN.*?(?<!")",/;
const REGEX_STATEMENT_COMMIT: RegExp = /"statement: COMMIT.*?(?<!")",/;

// eslint-disable-next-line @rushstack/typedef-var
const PRISMA_ENV_OPTIONS = {
  DATABASE_URL: dotenv.EMBEDDED_DATABASE_URL!,
} as const;

export async function startDevelopmentWorker(): Promise<void> {
  await embeddedPostgres();
  console.log('Embedded Postgres started');

  // execute shell command `prisma db push`
  console.log(
    await execShellCommand('prisma db push --force-reset', PRISMA_ENV_OPTIONS),
  );

  let begin = false;
  const statements: string[] = [];

  let i = 0;
  processLines(
    async (line) => {
      const { statement: beginStatement } = parseCsvLine(
        line,
        (line) => line.includes('chainweb-data'),
        REGEX_STATEMENT_BEGIN,
      );

      if (begin && beginStatement !== undefined) {
        throw new Error('begin statement found while begin is true');
      }

      if (beginStatement !== undefined) {
        begin = true;
      }

      if (begin) {
        const { statement: insertStatement } = parseCsvLine(
          line,
          (line) => line.includes('chainweb-data'),
          REGEX_STATEMENT_INSERT_INTO,
        );
        if (insertStatement !== undefined) {
          statements.push(insertStatement);
        } else {
          const { statement: commitStatement } = parseCsvLine(
            line,
            (line) => line.includes('chainweb-data'),
            REGEX_STATEMENT_COMMIT,
          );
          if (commitStatement !== undefined) {
            begin = false;

            stdout.write('.');
            await prismaClient
              .$transaction(
                statements.map((statement) =>
                  prismaClient.$executeRawUnsafe(statement),
                ),
              )
              .catch(console.error);

            if (i > 5 && statements.length > 0) {
              await new Promise((resolve) => setTimeout(resolve, 2000));
            }
            i++;
          }
        }
      }
    },
    join(__dirname, './postgresql-log-clean.csv'),
  ).catch(console.error);
}

interface IPostgresLogLine {
  statement?: string;
}

function parseCsvLine(
  line: string,
  condition: (line: string) => boolean,
  regex: RegExp,
): IPostgresLogLine {
  if (!condition(line)) {
    return { statement: undefined };
  }

  const statement = line.match(regex)?.[0];

  return {
    statement:
      statement !== undefined
        ? statement
            .replace(/("statement: |,$)/g, '')
            .replace(/""/g, '"')
            .replace(/"$/, '')
        : undefined,
  };
}
