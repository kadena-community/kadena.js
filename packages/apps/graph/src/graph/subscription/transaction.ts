import { prismaClient } from '@db/prisma-client';
import type { Transaction } from '@prisma/client';
import type { IContext } from '../builder';
import { builder } from '../builder';
import GQLTransaction from '../objects/transaction';

builder.subscriptionField('transaction', (t) =>
  t.field({
    description: 'Listen for a transaction by request key.',
    args: {
      requestKey: t.arg.string({ required: true }),
    },
    type: GQLTransaction,
    nullable: true,
    subscribe: (__root, args, context) => iteratorFn(args.requestKey, context),
    resolve: (parent) => parent,
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
