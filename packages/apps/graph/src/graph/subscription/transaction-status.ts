import { prismaClient } from '@db/prisma-client';
import { mempoolLookup } from '@services/chainweb-node/mempool';
import type { IContext } from '../builder';
import { builder } from '../builder';
import { GQLTransactionSubscriptionResponse } from '../objects/transaction-subscription';
import type { TransactionSubscriptionResponse } from '../types/graphql-types';

builder.subscriptionField('transactionStatus', (t) =>
  t.field({
    description:
      'Listen for a transaction by request key. Returns the ID when it is in a block.',
    args: {
      requestKey: t.arg.string({ required: true }),
      chainId: t.arg.string({ required: true }),
    },
    type: GQLTransactionSubscriptionResponse,
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
): AsyncGenerator<TransactionSubscriptionResponse | undefined, void, unknown> {
  let isCompleted = false;
  while (!context.req.socket.destroyed || isCompleted) {
    const transaction = await prismaClient.transaction.findFirst({
      where: {
        requestKey: requestKey,
        chainId: parseInt(chainId),
      },
    });

    if (transaction) {
      yield { transaction, status: 'COMPLETED' };
      isCompleted = true;
      return;
    } else {
      const mempoolResponse = await checkMempoolForTransaction(
        requestKey,
        chainId,
      );

      if (mempoolResponse) {
        yield mempoolResponse;
        return;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function checkMempoolForTransaction(
  hash: string,
  chainId: string,
): Promise<TransactionSubscriptionResponse> {
  try {
    const mempoolData = await mempoolLookup(hash, chainId);
    if (mempoolData.length > 0) {
      return {
        status: 'MISSING',
        transaction: null,
      };
    }

    const transactionData = mempoolData[0];

    if (transactionData.tag === 'Missing') {
      return {
        status: 'MISSING',
        transaction: null,
      };
    }

    if (transactionData.tag === 'Pending') {
      return {
        status: 'PENDING',
        transaction: JSON.parse(transactionData.contents),
      };
    }

    return {
      status: 'MISSING',
      transaction: null,
    };
  } catch (error) {
    return {
      status: 'MISSING',
      transaction: null,
    };
  }
}
