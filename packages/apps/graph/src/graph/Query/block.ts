import { prismaClient } from '@db/prismaClient';
import { normalizeError } from '@utils/errors';
import _debug from 'debug';
import { builder } from '../builder';
import Block from '../objects/Block';

builder.queryField('block', (t) => {
  return t.prismaField({
    args: {
      hash: t.arg.string({ required: true }),
    },
    type: Block,
    nullable: true,
    async resolve(__query, __parent, args) {
      try {
        const block = await prismaClient.block.findUnique({
          where: {
            hash: args.hash,
          },
        });

        return block;
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
});
