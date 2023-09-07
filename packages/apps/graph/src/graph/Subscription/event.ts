import { prismaClient } from '../../db/prismaClient';
import { dotenv } from '../../utils/dotenv';
import type { IContext } from '../builder';
import { builder } from '../builder';

import type { Event } from '@prisma/client';
import type { Debugger } from 'debug';
import _debug from 'debug';

const log: Debugger = _debug('graph:Subscription:event');

builder.subscriptionField('event', (t) => {
  return t.prismaField({
    args: {
      name: t.arg.string({ required: true }),
      chainIds: t.arg.intList({ required: false }),
    },
    type: ['Event'],
    nullable: true,
    subscribe: (parent, args, context, info) =>
      iteratorFn(args.name, args.chainIds as number[] | undefined, context),
    resolve: (__, event) => event as Event[],
  });
});

async function* iteratorFn(
  eventName: string,
  chainIds: number[] = Array.from(new Array(dotenv.CHAIN_COUNT)).map(
    (__, i) => i,
  ),
  context: IContext,
): AsyncGenerator<Event[] | undefined, void, unknown> {
  while (true) {
    const event = await prismaClient.event.findMany({
      where: {
        qualname: eventName,
        chainid: {
          in: chainIds,
        },
      },
    });

    if (event) {
      log('event found', event);
      yield event;
    }

    log(`waiting for event ${name}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
