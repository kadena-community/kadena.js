import { prismaClient } from '@db/prisma-client';
import { queryFromInfo } from '@pothos/plugin-prisma';
import { COMPLEXITY } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import Block from '../objects/block';

builder.queryField('block', (t) =>
  t.prismaField({
    description: 'Retrieve a block by hash.',
    args: {
      hash: t.arg.string({ required: true }),
    },
    type: Block,
    nullable: true,
    complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
    async resolve(query, __parent, args, context, info) {
      try {
        const res = queryFromInfo({
          info,
          context,
        });
        const block = await prismaClient.block.findUnique({
          ...res,
          ...query,
          where: {
            hash: args.hash,
          },
        });

        return block;
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
