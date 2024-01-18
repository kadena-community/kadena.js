import { prismaClient } from '@db/prisma-client';
import { createID } from '@utils/global-id';
import type { IContext } from '../builder';
import { builder } from '../builder';
import GQLTransaction from '../objects/transaction';

builder.subscriptionField('transaction', (t) =>
  t.field({
    description:
      'Listen for a transaction by request key. Returns the ID when it is in a block.',
    args: {
      requestKey: t.arg.string({ required: true }),
    },
    type: 'ID',
    nullable: true,
    subscribe: (__root, args, context) => iteratorFn(args.requestKey, context),
    resolve: (parent) => parent,
  }),
);

async function* iteratorFn(
  requestKey: string,
  context: IContext,
): AsyncGenerator<string | undefined, void, unknown> {
  while (!context.req.socket.destroyed) {
    const transaction = await prismaClient.transaction.findFirst({
      where: {
        requestKey: requestKey,
      },
    });

    if (transaction) {
      yield createID(GQLTransaction.name, [
        transaction.blockHash,
        transaction.requestKey,
      ]);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
