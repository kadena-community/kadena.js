import { prismaClient } from '@db/prismaClient';
import { COMPLEXITY } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';

builder.queryField('lastBlockHeight', (t) =>
  t.field({
    description: 'Get the height of the block with the highest height.',
    type: 'BigInt',
    nullable: true,
    complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
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
