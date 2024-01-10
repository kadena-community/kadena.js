import { prismaClient } from '@db/prisma-client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';

builder.queryField('event', (t) =>
  t.prismaField({
    description: 'Retrieve a single event by its unique key.',
    nullable: true,
    args: {
      blockHash: t.arg.string({ required: true }),
      orderIndex: t.arg.int({ required: true }),
      requestKey: t.arg.string({ required: true }),
    },
    type: 'Event',
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

builder.queryField('events', (t) =>
  t.prismaConnection({
    description: 'Retrieve events.',
    edgesNullable: false,
    args: {
      qualifiedEventName: t.arg.string({ required: true }),
    },
    type: 'Event',
    cursor: 'blockHash_orderIndex_requestKey',
    complexity: (args) => ({
      field: getDefaultConnectionComplexity({
        withRelations: true,
        first: args.first,
        last: args.last,
      }),
    }),
    async totalCount(__parent, args) {
      try {
        return await prismaClient.event.count({
          where: {
            qualifiedName: args.qualifiedEventName,
          },
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
    async resolve(query, __parent, args) {
      try {
        return await prismaClient.event.findMany({
          ...query,
          where: {
            qualifiedName: args.qualifiedEventName,
            transaction: {
              NOT: [],
            },
          },
          orderBy: {
            id: 'desc',
          },
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
