import { prismaClient } from '@db/prismaClient';
import type { Transaction } from '@prisma/client';
import _debug from 'debug';
import type { IContext } from '../builder';
import { builder } from '../builder';

builder.subscriptionField('transaction', (t) => {
  return t.prismaField({
    args: {
      requestKey: t.arg.string({ required: true }),
    },
    type: 'Transaction',
    nullable: true,
    subscribe: (parent, args, context, info) =>
      iteratorFn(args.requestKey, context),
    resolve: (__, transaction) => transaction,
  });
});

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
