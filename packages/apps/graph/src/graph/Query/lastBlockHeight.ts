import { prismaClient } from '@db/prismaClient';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';

builder.queryField('lastBlockHeight', (t) =>
  t.field({
    description: 'Get the height of the latest block.',
    type: 'BigInt',
    nullable: true,
    async resolve() {
      try {
        const lastBlock = await prismaClient.block.findFirst({
          orderBy: {
            height: 'desc',
          },
        });

        return lastBlock?.height;
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
