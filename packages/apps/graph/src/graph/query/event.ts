import { prismaClient } from '@db/prisma-client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import Event from '../objects/event';

builder.queryField('event', (t) =>
  t.prismaField({
    description: 'Retrieve a single event by its unique key.',
    nullable: true,
    args: {
      blockHash: t.arg.string({ required: true }),
      orderIndex: t.arg.int({ required: true }),
      requestKey: t.arg.string({ required: true }),
    },
    type: Event,
    complexity: getDefaultConnectionComplexity(),
    async resolve(query, __parent, args) {
      try {
        return await prismaClient.event.findUnique({
          ...query,
          where: {
            blockHash_orderIndex_requestKey: {
              blockHash: args.blockHash,
              orderIndex: args.orderIndex,
              requestKey: args.requestKey,
            },
          },
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
