import type { Transaction } from '@prisma/client';
import type { Debugger } from 'debug';
import _debug from 'debug';
import { prismaClient } from '../../db/prismaClient';
import type { IContext } from '../builder';
import { builder } from '../builder';

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
  context: IContext,
): AsyncGenerator<Transaction | undefined, void, unknown> {
  while (!context.req.socket.destroyed) {
    const transaction = await prismaClient.transaction.findFirst({
      where: {
        requestKey: requestKey,
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
