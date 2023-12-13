import { prismaClient } from '@db/prisma-client';
import type { Transaction } from '@prisma/client';
import type { IContext } from '../builder';
import { builder } from '../builder';

builder.subscriptionField('transaction', (t) =>
  t.prismaField({
    description:
      'Listen for a transaction by request key. Returns when it is in a block.',
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
