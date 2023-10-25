import type { Debugger } from 'debug';
import _debug from 'debug';
import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';
import Block from '../objects/Block';

const log: Debugger = _debug('graph:Query:block');

builder.queryField('block', (t) => {
  return t.prismaField({
    args: {
      hash: t.arg.string({ required: true }),
    },

    type: Block,

    resolve: async (__query, __parent, { hash }) => {
      log('searching for block with hash:', hash);

      const block = await prismaClient.block.findUnique({
        where: {
          hash,
        },
      });

      log('found block', block);
      if (!block) {
        throw new Error(`Block not found for hash: ${hash}`);
      }
      return block;
    },
  });
});
