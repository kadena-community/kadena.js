import { prismaClient } from '@db/prisma-client';
import { mempoolLookup } from '@services/chainweb-node/mempool';
import type { IContext } from '../builder';
import { builder } from '../builder';
import {
  mempooTransactionMapper,
  prismaTransactionMapper,
} from '../mappers/transaction-mapper';
import GQLTransactions from '../objects/transaction';
import type { Transaction } from '../types/graphql-types';

builder.subscriptionField('transaction', (t) =>
  t.field({
    description: 'Listen for a transaction by request key.',
    args: {
      requestKey: t.arg.string({ required: true }),
      chainId: t.arg.string({ required: false }),
    },
    type: GQLTransactions,
    nullable: true,
    subscribe: (__root, args, context) =>
      iteratorFn(
        args.requestKey,
        context,
        args.chainId ? args.chainId : undefined,
      ),
    resolve: (parent) => parent,
  }),
);

async function* iteratorFn(
  requestKey: string,
  context: IContext,
  chainId?: string,
): AsyncGenerator<Transaction | undefined, void, unknown> {
  while (!context.req.socket.destroyed) {
    const transaction = await prismaClient.transaction.findFirst({
      where: {
        requestKey: requestKey,
        ...(chainId && { chainId: parseInt(chainId) }),
      },
    });

    if (transaction) {
      yield prismaTransactionMapper(transaction, context);
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
  chainId?: string,
): Promise<Transaction | null> {
  try {
    const mempoolData = await mempoolLookup(hash, chainId);
    if (mempoolData.length === 0) {
      return null;
    }

    const transactionData = mempoolData[0];

    if (transactionData.tag === 'Pending') {
      return mempooTransactionMapper(transactionData);
    }

    return null;
  } catch (error) {
    return null;
  }
}
