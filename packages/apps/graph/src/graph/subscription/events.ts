import { prismaClient } from '@db/prisma-client';
import type { Event } from '@prisma/client';
import {
  createBlockDepthMap,
  getConditionForMinimumDepth,
} from '@services/depth-service';
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
  let lastEventId;

  lastEventId = await getLatestEventId(
    qualifiedEventName,
    chainId,
    parametersFilter,
    minimumDepth,
  );

  if (!nullishOrEmpty(lastEventId)) {
    yield [];
  }

  while (!context.req.socket.destroyed) {
    const newEvents = await getLastEvents(
      qualifiedEventName,
      lastEventId ?? undefined,
      chainId,
      parametersFilter,
      minimumDepth,
    );

    if (!nullishOrEmpty(newEvents)) {
      lastEventId = newEvents[0].id;
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
          chainId ? [chainId] : undefined,
        ),
      }),
    },
  });

  let eventsToReturn = foundEvents;

  if (minimumDepth) {
    const blockHashToDepth = await createBlockDepthMap(
      eventsToReturn,
      'blockHash',
    );

    eventsToReturn = foundEvents.filter(
      (event) => blockHashToDepth[event.blockHash] >= minimumDepth,
    );
  }

  return eventsToReturn.sort((a, b) => b.id - a.id);
}

async function getLatestEventId(
  eventName: string,
  chainId?: string | null,
  parametersFilter?: string | null,
  minimumDepth?: number | null,
) {
  try {
    let lastEventId = await prismaClient.event.aggregate({
      _max: {
        id: true,
      },
      where: {
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
            chainId ? [chainId] : undefined,
          ),
        }),
      },
    });
    return lastEventId._max.id;
  } catch (error) {
    return null;
  }
}
