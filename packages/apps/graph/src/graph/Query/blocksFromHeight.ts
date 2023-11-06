import { prismaClient } from '@db/prismaClient';
import { dotenv } from '@utils/dotenv';
import { normalizeError } from '@utils/errors';
import type { Debugger } from 'debug';
import _debug from 'debug';
import { builder } from '../builder';
import Block from '../objects/Block';

const log: Debugger = _debug('graph:Query:blocksFromHeight');

builder.queryField('blocksFromHeight', (t) => {
  return t.prismaField({
    args: {
      startHeight: t.arg.int({ required: true }),
      chainIds: t.arg.intList({ required: false }),
    },
    type: [Block],
    async resolve(
      __query,
      __parent,
      {
        startHeight,
        chainIds = Array.from(new Array(dotenv.CHAIN_COUNT)).map((__, i) => i),
      },
    ) {
      try {
        const blocksFromHeight = await prismaClient.block.findMany({
          where: {
            AND: [
              {
                height: {
                  gte: startHeight,
                },
              },
              {
                chainId: {
                  in: chainIds as number[],
                },
              },
            ],
          },
        });

        log("found '%s' blocks", blocksFromHeight.length);
        return blocksFromHeight;
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
});
