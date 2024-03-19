import { prismaClient } from '@db/prisma-client';
import type { Event } from '@prisma/client';
import { nullishOrEmpty } from '@utils/nullish-or-empty';
import { parsePrismaJsonColumn } from '@utils/prisma-json-columns';
import type { IContext } from '../builder';
import { builder } from '../builder';
import GQLEvent from '../objects/event';

builder.subscriptionField('events', (t) =>
  t.field({
    description: 'Listen for events by qualifiedName (e.g. `coin.TRANSFER`).',
    args: {
      qualifiedEventName: t.arg.string({ required: true }),
      chainId: t.arg.string(),
      parametersFilter: t.arg.string(),
    },
    type: [GQLEvent],
    nullable: true,
    subscribe: (__root, args, context) =>
      iteratorFn(
        context,
        args.qualifiedEventName,
        args.chainId,
        args.parametersFilter,
      ),
    resolve: (parent) => parent,
  }),
);

async function* iteratorFn(
  context: IContext,
  qualifiedEventName: string,
  chainId?: string | null,
  parametersFilter?: string | null,
): AsyncGenerator<Event[] | undefined, void, unknown> {
  const eventResult = await getLastEvents(
    qualifiedEventName,
    undefined,
    chainId,
    parametersFilter,
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
    },
  });

  return foundEvents.sort((a, b) => b.id - a.id);
}
