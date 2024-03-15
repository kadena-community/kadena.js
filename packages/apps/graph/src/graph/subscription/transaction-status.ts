import { prismaClient } from '@db/prisma-client';
import { mempoolLookup } from '@services/chainweb-node/mempool';
import type { IContext } from '../builder';
import { builder } from '../builder';
import GQLTransactions1 from '../objects/transaction1';
import type { Transaction1 } from '../types/graphql-types';
import {
  mempoolTxMapper,
  prismaTransactionMapper,
} from '../utils/transaction-mapper';

builder.subscriptionField('transactionStatus', (t) =>
  t.field({
    description:
      'Listen for a transaction by request key. Returns the transaction when found.',
    args: {
      requestKey: t.arg.string({ required: true }),
      chainId: t.arg.string({ required: true }),
    },
    type: GQLTransactions1,
    nullable: true,
    subscribe: (__root, args, context) =>
      iteratorFn(args.requestKey, args.chainId, context),
    resolve: (parent) => parent,
  }),
);

async function* iteratorFn(
  requestKey: string,
  chainId: string,
  context: IContext,
): AsyncGenerator<Transaction1 | undefined, void, unknown> {
  while (!context.req.socket.destroyed) {
    const transaction = await prismaClient.transaction.findFirst({
      where: {
        requestKey: requestKey,
        chainId: parseInt(chainId),
      },
    });

    if (transaction) {
      yield prismaTransactionMapper(transaction, [], context);
      return;
    } else {
      const mempoolResponse = await checkMempoolForTransaction(
        requestKey,
        chainId,
      );

      if (mempoolResponse) {
        yield mempoolResponse;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function checkMempoolForTransaction(
  hash: string,
  chainId: string,
): Promise<Transaction1 | null> {
  try {
    const mempoolData = await mempoolLookup(hash, chainId);
    if (mempoolData.length === 0) {
      return null;
    }

    const transactionData = mempoolData[0];

    if (transactionData.tag === 'Pending') {
      return mempoolTxMapper(transactionData);
    }

    return null;
  } catch (error) {
    return null;
  }
}
