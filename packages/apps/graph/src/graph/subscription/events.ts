import { prismaClient } from '@db/prisma-client';
import type { Event } from '@prisma/client';
import { getConditionForMinimumDepth } from '@services/confirmation-depth-service';
import { chainIds } from '@utils/chains';
import { nullishOrEmpty } from '@utils/nullish-or-empty';
import { parsePrismaJsonColumn } from '@utils/prisma-json-columns';
import type { IContext } from '../builder';
import { builder } from '../builder';
import GQLEvent from '../objects/event';

builder.subscriptionField('events', (t) =>
  t.field({
    description: `Listen for events by qualifiedName (e.g. \`coin.TRANSFER\`).
       
      The parametersFilter is a stringified JSON object that matches the [JSON object property filters](https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields#filter-on-object-property) from Prisma.
       
      An example of such a filter parameter value: \`events(parametersFilter: "{\\"array_starts_with\\": \\"k:abcdefg\\"}")\``,
    args: {
      qualifiedEventName: t.arg.string({
        required: true,
        validate: {
          minLength: 1,
        },
      }),
      chainId: t.arg.string({
        required: false,
        validate: {
          minLength: 1,
        },
      }),
      parametersFilter: t.arg.string({
        required: false,
        validate: {
          minLength: 1,
        },
      }),
      minimumDepth: t.arg.int({
        required: false,
        validate: {
          nonnegative: true,
        },
      }),
    },
    type: [GQLEvent],
    nullable: true,
    subscribe: (__root, args, context) =>
      iteratorFn(
        context,
        args.qualifiedEventName,
        args.chainId,
        args.parametersFilter,
        args.minimumDepth,
      ),
    resolve: (parent) => parent,
  }),
);

async function* iteratorFn(
  context: IContext,
  qualifiedEventName: string,
  chainId?: string | null,
  parametersFilter?: string | null,
  minimumDepth?: number | null,
): AsyncGenerator<Event[] | undefined, void, unknown> {
  const eventResult = await getLastEvents(
    qualifiedEventName,
    undefined,
    chainId,
    parametersFilter,
    minimumDepth,
  );

  let lastEvent;

  if (!nullishOrEmpty(eventResult)) {
    lastEvent = eventResult[0];
    yield [];
  }

  while (!context.req.socket.destroyed) {
    const newEvents = await getLastEvents(
      qualifiedEventName,
      lastEvent?.id,
      chainId,
      parametersFilter,
      minimumDepth,
    );

    if (!nullishOrEmpty(newEvents)) {
      lastEvent = newEvents[0];
      yield newEvents;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function getLastEvents(
  eventName: string,
  id?: number,
  chainId?: string | null,
  parametersFilter?: string | null,
  minimumDepth?: number | null,
): Promise<Event[]> {
  const defaultFilter: Parameters<typeof prismaClient.event.findMany>[0] = {
    orderBy: {
      id: 'desc',
    },
  } as const;

  const extendedFilter =
    id === undefined
      ? { take: 5, ...defaultFilter }
      : {
          take: 100,
          where: { id: { gt: id } },
        };

  const foundEvents = await prismaClient.event.findMany({
    ...extendedFilter,
    where: {
      ...extendedFilter.where,
      qualifiedName: eventName,
      transaction: {
        NOT: [],
      },
      ...(chainId && {
        chainId: parseInt(chainId),
      }),
      ...(parametersFilter && {
        parameters: parsePrismaJsonColumn(parametersFilter, {
          subscription: 'events',
          queryParameter: 'parametersFilter',
          column: 'parameters',
        }),
      }),
      ...(minimumDepth && {
        OR: await getConditionForMinimumDepth(
          minimumDepth,
          chainId ? [chainId] : chainIds,
        ),
      }),
    },
  });

  return foundEvents.sort((a, b) => b.id - a.id);
}
