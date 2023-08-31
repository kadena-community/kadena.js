import { prismaClient } from '../../db/prismaClient';
import { builder, Context } from '../builder';

import { Transaction } from '@prisma/client';
import _debug, { Debugger } from 'debug';

const log: Debugger = _debug('graph:Subscription:transaction');

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
  context: Context,
): AsyncGenerator<Transaction | null, void, unknown> {
  while (!context.req.socket.destroyed) {
    const transaction = await prismaClient.transaction.findFirst({
      where: {
        requestkey: requestKey,
      },
    });

    if (transaction) {
      log('transaction found', transaction);
      yield transaction;
      return;
    }

    log(`waiting for transaction ${requestKey}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
