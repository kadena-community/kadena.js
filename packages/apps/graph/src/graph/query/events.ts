import { prismaClient } from '@db/prisma-client';
import { Prisma } from '@prisma/client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { parsePrismaJsonColumn } from '@utils/prisma-json-columns';
import { builder } from '../builder';

const generateEventsFilter = (args: {
  qualifiedEventName: string;
  chainId?: string | null | undefined;
  parametersFilter?: string | null | undefined;
  blockHash?: string | null | undefined;
  orderIndex?: number | null | undefined;
  requestKey?: string | null | undefined;
}): Prisma.EventWhereInput => ({
  qualifiedName: args.qualifiedEventName,
  transaction: {
    NOT: [],
  },
  ...(args.parametersFilter && {
    parameters: parsePrismaJsonColumn(args.parametersFilter, {
      query: 'events',
      queryParameter: 'parametersFilter',
      column: 'parameters',
    }),
  }),
  ...(args.chainId && { chainId: parseInt(args.chainId) }),
  ...(args.blockHash && { blockHash: args.blockHash }),
  ...(args.orderIndex && { orderIndex: args.orderIndex }),
  ...(args.requestKey && { requestKey: args.requestKey }),
});

builder.queryField('events', (t) =>
  t.prismaConnection({
    description: `Retrieve events by qualifiedName (e.g. \`coin.TRANSFER\`). Default page size is 20.
       
      The parametersFilter is a stringified JSON object that matches the [JSON object property filters](https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields#filter-on-object-property) from Prisma.
       
      An example of such a filter parameter value: \`events(parametersFilter: "{\\"array_starts_with\\": \\"k:abcdefg\\"}")\``,
    edgesNullable: false,
    args: {
      qualifiedEventName: t.arg.string({ required: true }),
      chainId: t.arg.string({ required: false }),
      parametersFilter: t.arg.string({ required: false }),
      blockHash: t.arg.string({ required: false }),
      orderIndex: t.arg.int({ required: false }),
      requestKey: t.arg.string({ required: false }),
    },
    type: Prisma.ModelName.Event,
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
          where: generateEventsFilter(args),
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
    async resolve(query, __parent, args) {
      try {
        return await prismaClient.event.findMany({
          ...query,
          where: generateEventsFilter(args),
          orderBy: [
            { height: 'desc' },
            { requestKey: 'desc' },
            { orderIndex: 'desc' },
          ],
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
