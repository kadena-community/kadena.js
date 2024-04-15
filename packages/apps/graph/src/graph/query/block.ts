import { prismaClient } from '@db/prisma-client';
import { COMPLEXITY } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import Block from '../objects/block';

builder.queryField('block', (t) =>
  t.prismaField({
    description: 'Retrieve a block by hash.',
    args: {
      hash: t.arg.string({
        required: true,
        validate: {
          minLength: 1,
        },
      }),
    },
    type: Block,
    nullable: true,
    complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
    async resolve(query, __parent, args) {
      try {
        return await prismaClient.block.findUnique({
          ...query,
          where: {
            hash: args.hash,
          },
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
