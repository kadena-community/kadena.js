import { prismaClient } from '@src/db/prismaClient';
import { normalizeError } from '@src/utils/errors';
import type { Debugger } from 'debug';
import _debug from 'debug';
import { builder } from '../builder';
import Block from '../objects/Block';

const log: Debugger = _debug('graph:Query:block');

builder.queryField('block', (t) => {
  return t.prismaField({
    args: {
      hash: t.arg.string({ required: true }),
    },
    type: Block,
    nullable: true,
    async resolve(__query, __parent, args) {
      try {
        log('searching for block with hash:', args.hash);

        const block = await prismaClient.block.findUnique({
          where: {
            hash: args.hash,
          },
        });

        log(`block with hash '${args.hash}' ${block ? '' : 'not'} found`);

        return block;
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
});
