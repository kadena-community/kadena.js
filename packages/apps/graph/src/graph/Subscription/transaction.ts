import { prismaClient } from '@db/prismaClient';
import type { Transaction } from '@prisma/client';
import type { IContext } from '../builder';
import { builder } from '../builder';

builder.subscriptionField('transaction', (t) =>
  t.prismaField({
    description:
      'Subscribe to a request key to wait for the related transaction to appear.',
    args: {
      requestKey: t.arg.string({ required: true }),
    },
    type: 'Transaction',
    nullable: true,
    subscribe: (__parent, args, context) =>
      iteratorFn(args.requestKey, context),
    resolve: (__query, parent) => parent as Transaction,
  }),
);

async function* iteratorFn(
  requestKey: string,
  context: IContext,
): AsyncGenerator<Transaction | undefined, void, unknown> {
  while (!context.req.socket.destroyed) {
    const transaction = await prismaClient.transaction.findFirst({
      where: {
        requestKey: requestKey,
      },
    });

    if (transaction) {
      yield transaction;
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
