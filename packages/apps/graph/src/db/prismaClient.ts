import { PrismaClient } from '@prisma/client';
import { dotenv } from '../utils/dotenv';

const url: string | undefined = dotenv.DATABASE_URL;

const options:
  | {
      datasources: {
        db: {
          url: string;
        };
      };
    }
  | undefined =
  url !== undefined
    ? {
        datasources: {
          db: {
            url,
          },
        },
      }
    : undefined;

// eslint-disable-next-line @rushstack/typedef-var
export const prismaClient = new PrismaClient(options);
