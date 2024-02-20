import { prismaClient } from '@db/prisma-client';
import { createID } from '@utils/global-id';
import { nullishOrEmpty } from '@utils/nullish-or-empty';
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
    type: ['ID'],
    nullable: true,
    subscribe: (__root, args, context) =>
      iteratorFn(
        args.qualifiedEventName,
        context,
        args.chainId,
        args.parametersFilter,
      ),
    resolve: (parent) => parent,
  }),
);

async function* iteratorFn(
  qualifiedEventName: string,
  context: IContext,
  chainId?: string | null,
  parametersFilter?: string | null,
): AsyncGenerator<string[] | undefined, void, unknown> {
  const eventResult = await getLastEvents(
    qualifiedEventName,
    undefined,
    chainId,
    parametersFilter,
  );
  let lastEvent;

  if (!nullishOrEmpty(eventResult)) {
    lastEvent = eventResult[0];
    yield [
      createID(GQLEvent.name, [
        lastEvent.blockHash,
        lastEvent.orderIndex,
        lastEvent.requestKey,
      ]),
    ];
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
      yield newEvents.map((event) =>
        createID(GQLEvent.name, [
          event.blockHash,
          event.orderIndex,
          event.requestKey,
        ]),
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function getLastEvents(
  eventName: string,
  id?: number,
  chainId?: string | null,
  parametersFilter?: string | null,
): Promise<
  { blockHash: string; orderIndex: bigint; requestKey: string; id: number }[]
> {
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
        parameters: JSON.parse(parametersFilter),
      }),
    },
    select: {
      id: true,
      blockHash: true,
      orderIndex: true,
      requestKey: true,
    },
  });

  return foundEvents.sort((a, b) => b.id - a.id);
}
