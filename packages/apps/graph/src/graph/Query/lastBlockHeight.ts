import { prismaClient } from '@db/prismaClient';
import { normalizeError } from '@utils/errors';
import type { Debugger } from 'debug';
import _debug from 'debug';
import { builder } from '../builder';

const log: Debugger = _debug('graph:Query:lastBlockHeight');

builder.queryField('lastBlockHeight', (t) => {
  return t.field({
    type: 'BigInt',
    nullable: true,
    async resolve() {
      try {
        const lastBlock = await prismaClient.block.findFirst({
          orderBy: {
            height: 'desc',
          },
        });

        log('lastBlock found:', lastBlock?.height);

        return lastBlock?.height;
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
});
