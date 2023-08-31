import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

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
    subscribe: (parent, args, context, info) => iteratorFn(args.requestKey),
    resolve: (__, transaction) => transaction,
  });
});

async function* iteratorFn(
  requestKey: string,
): AsyncGenerator<Transaction, void, unknown> {
  console.log('iteratorFn', requestKey);
  log('iteratorFn', requestKey);
  while (true) {
    const transaction = await prismaClient.transaction.findFirst({
      where: {
        requestkey: requestKey,
      },
    });

    if (transaction) {
      console.log('transaction found', transaction);
      log('transaction found', transaction);
      yield transaction;
      return;
    }

    console.log('waiting for transaction ' + requestKey);
    log('waiting for transaction ' + requestKey);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}