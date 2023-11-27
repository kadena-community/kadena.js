import { prismaClient } from '@db/prismaClient';
import type { Event } from '@prisma/client';
import { nullishOrEmpty } from '@utils/nullishOrEmpty';
import type { IContext } from '../builder';
import { builder } from '../builder';

builder.subscriptionField('event', (t) => {
  return t.prismaField({
    args: {
      eventName: t.arg.string({ required: true }),
    },
    type: ['Event'],
    nullable: true,
    subscribe: (__parent, args, context) => iteratorFn(args.eventName, context),
    resolve: (__query, parent) => parent as Event[],
  });
});

async function* iteratorFn(
  eventName: string,
  context: IContext,
): AsyncGenerator<Event[] | undefined, void, unknown> {
  // Get the last event and yield it
  const eventResult = await getLastEvent(eventName);
  let lastEvent;

  if (!nullishOrEmpty(eventResult)) {
    lastEvent = eventResult[0];
    yield [lastEvent];
  }

  while (!context.req.socket.destroyed) {
    // Get new events
    const newEvents = await getLastEvent(eventName, lastEvent?.id);

    if (!nullishOrEmpty(newEvents) && lastEvent?.id !== newEvents?.[0]?.id) {
      lastEvent = newEvents[newEvents.length - 1];
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

  return foundEvents;
}
