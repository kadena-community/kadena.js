import { prismaClient } from '@db/prisma-client';
import type { Event } from '@prisma/client';
import { nullishOrEmpty } from '@utils/nullish-or-empty';
import type { IContext } from '../builder';
import { builder } from '../builder';

builder.subscriptionField('events', (t) =>
  t.prismaField({
    description: 'Listen for events by qualifiedName (e.g. `coin.TRANSFER`).',
    args: {
      qualifiedEventName: t.arg.string({ required: true }),
    },
    type: ['Event'],
    nullable: true,
    subscribe: (__parent, args, context) =>
      iteratorFn(args.qualifiedEventName, context),
    resolve: (__query, parent) => parent as Event[],
  }),
);

async function* iteratorFn(
  qualifiedEventName: string,
  context: IContext,
): AsyncGenerator<Event[] | undefined, void, unknown> {
  // Get the last event and yield it
  const eventResult = await getLastEvent(qualifiedEventName);
  let lastEvent;

  if (!nullishOrEmpty(eventResult)) {
    lastEvent = eventResult[0];
    yield [lastEvent];
  }

  while (!context.req.socket.destroyed) {
    // Get new events
    const newEvents = await getLastEvent(qualifiedEventName, lastEvent?.id);

    if (!nullishOrEmpty(newEvents)) {
      lastEvent = newEvents[0];
      yield newEvents;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function getLastEvent(eventName: string, id?: number): Promise<Event[]> {
  // Define a default filter for the query
  const defaultFilter: Parameters<typeof prismaClient.event.findMany>[0] = {
    orderBy: {
      id: 'desc',
    },
  } as const;

  // Define an extended filter for the query: if id is undefined, take 5 events, otherwise take 500 events
  const extendedFilter =
    id === undefined
      ? { take: 5, ...defaultFilter }
      : {
          take: 100,
          where: { id: { gt: id } },
        };

  // Find the events
  const foundEvents = await prismaClient.event.findMany({
    ...extendedFilter,
    where: {
      ...extendedFilter.where,
      qualifiedName: eventName,
      transaction: {
        NOT: [],
      },
    },
  });

  // sort by id desc
  return foundEvents.sort((a, b) => b.id - a.id);
}
