import { prismaClient } from '@db/prisma-client';
import { Prisma } from '@prisma/client';
import { COMPLEXITY } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';

export default builder.prismaNode(Prisma.ModelName.MinerKey, {
  description: 'The account of the miner that solved a block.',
  id: { field: 'blockHash_key' },
  select: {},
  fields: (t) => ({
    blockHash: t.exposeString('blockHash'),
    key: t.exposeString('key'),
    block: t.prismaField({
      type: Prisma.ModelName.Block,
      nullable: false,
      complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
      select: {
        blocks: true,
        blockHash: true,
      },
      async resolve(query, parent) {
        try {
          return (
            parent.blocks ||
            (await prismaClient.block.findUniqueOrThrow({
              ...query,
              where: {
                hash: parent.blockHash,
              },
            }))
          );
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),
  }),
});
