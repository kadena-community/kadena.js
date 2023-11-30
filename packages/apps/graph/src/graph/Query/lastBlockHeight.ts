import { prismaClient } from '@db/prismaClient';
import { normalizeError } from '@utils/errors';
import { COMPLEXITY, builder } from '../builder';

builder.queryField('lastBlockHeight', (t) => {
  return t.field({
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
  });
});
