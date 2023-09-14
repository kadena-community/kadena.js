import { prismaClient } from '../../db/prismaClient';
import { nullishOrEmpty } from '../../utils/nullishOrEmpty';
import type { IContext } from '../builder';
import { builder } from '../builder';

import type { Event, Transaction } from '@prisma/client';
import type { Debugger } from 'debug';
import _debug from 'debug';

const log: Debugger = _debug('graph:Subscription:event');

builder.subscriptionField('event', (t) => {
  return t.prismaField({
    args: {
      eventName: t.arg.string({ required: true }),
    },
    type: ['Event'],
    nullable: true,
    subscribe: (parent, args, context, info) =>
      iteratorFn(args.eventName, context),
    resolve: (__, event) => event as Event[],
  });
});

async function* iteratorFn(
  eventName: string,
  context: IContext,
): AsyncGenerator<Event[] | undefined, void, unknown> {
  // Get the last event and yield it
  let lastEvent = (await getLastEvent(eventName))[0];
  yield [lastEvent];

  log('yielding initial block with id %s', lastEvent.id);

  while (!context.req.socket.destroyed) {
    // Get new events
    const newEvents = await getLastEvent(eventName, lastEvent.id);

    if (nullishOrEmpty(newEvents) && lastEvent.id !== newEvents?.[0]?.id) {
      lastEvent = newEvents[newEvents.length - 1];
      yield newEvents;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function getLastEvent(eventName: string, id?: number) {
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
          take: 500,
          where: { id: { gt: id } },
        };

  // Find the events
  const foundEvents = await prismaClient.event.findMany({
    ...extendedFilter,
    where: {
      qualname: eventName,
      transaction: {
        NOT: [],
      },
    },
  });

  log("found '%s' events", foundEvents.length);

  return foundEvents;
}
