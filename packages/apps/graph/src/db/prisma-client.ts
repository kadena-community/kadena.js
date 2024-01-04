import { PrismaClient } from '@prisma/client';
import { dotenv } from '@utils/dotenv';

export const prismaClient = new PrismaClient({
  datasources: {
    db: {
      url: dotenv.DATABASE_URL,
    },
  },
});
