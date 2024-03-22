import { prismaClient } from '@db/prisma-client';
import { Prisma } from '@prisma/client';
import {
  getMempoolTransactionSigners,
  getMempoolTransactionStatus,
} from '@services/chainweb-node/mempool';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { nullishOrEmpty } from '@utils/nullish-or-empty';
import { builder } from '../builder';
import TransactionCommand from './transaction-command';
import TransactionResult from './transaction-result';

export default builder.prismaNode(Prisma.ModelName.Transaction, {
  description: 'A transaction.',
  // We can assume this id field because we never return connections when
  // querying transactions from the mempool
  id: {
    field: 'blockHash_requestKey',
  },
  fields: (t) => ({
    hash: t.exposeString('requestKey'),
    cmd: t.field({
      type: TransactionCommand,

      resolve: async (parent, __args, context) => {
        try {
          let signers = [];

          // This is needed because if the transaction is in the mempool, the
          // signers are not stored in the database and there is no status.
          // If blockHash has a value, we do not check the mempool for signers or status
          if (nullishOrEmpty(parent.blockHash)) {
            signers = await getMempoolTransactionSigners(
              parent.requestKey,
              parent.chainId.toString(),
            );
          } else {
            signers = await prismaClient.signer.findMany({
              where: {
                requestKey: parent.requestKey,
              },
            });
          }

          return {
            nonce: parent.nonce,
            meta: {
              chainId: parent.chainId,
              gasLimit: parent.gasLimit,
              gasPrice: parent.gasPrice,
              ttl: parent.ttl,
              creationTime: parent.creationTime,
              sender: parent.senderAccount,
            },
            payload: {
              code: JSON.stringify(parent.code),
              data: parent.data ? JSON.stringify(parent.data) : '',
              pactId: parent.pactId,
              step: Number(parent.step),
              rollback: parent.rollback,
              proof: parent.proof,
            },
            signers,
            networkId: context.networkId,
          };
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),
    result: t.field({
      type: TransactionResult,
      resolve: async (parent, args, context) => {
        return {
          badResult: parent.badResult ? JSON.stringify(parent.badResult) : null,
          continuation: parent.continuation
            ? JSON.stringify(parent.continuation)
            : null,
          gas: parent.gas,
          goodResult: parent.goodResult
            ? JSON.stringify(parent.goodResult)
            : null,
          height: parent.height,
          logs: parent.logs,
          metadata: parent.metadata ? JSON.stringify(parent.metadata) : null,
          eventCount: parent.eventCount,
          transactionId: parent.transactionId,
          blockHash: parent.blockHash,
          status: await getMempoolTransactionStatus(
            parent.requestKey,
            parent.chainId.toString(),
          ),
        };
      },
    }),
    block: t.prismaField({
      type: Prisma.ModelName.Block,
      nullable: true,
      resolve(__query, parent) {
        if (!parent.blockHash) {
          return null;
        } else {
          return prismaClient.block.findUnique({
            where: {
              hash: parent.blockHash,
            },
          });
        }
      },
    }),

    events: t.prismaConnection({
      type: Prisma.ModelName.Event,
      cursor: 'blockHash_orderIndex_requestKey',
      complexity: (args) => ({
        field: getDefaultConnectionComplexity({
          withRelations: true,
          first: args.first,
          last: args.last,
        }),
      }),
      async totalCount(parent) {
        if (!parent.blockHash) return 0;
        else {
          return await prismaClient.event.count({
            where: {
              blockHash: parent.blockHash,
              requestKey: parent.requestKey,
            },
          });
        }
      },
      async resolve(__query, parent) {
        if (!parent.blockHash) return [];
        else {
          return await prismaClient.event.findMany({
            where: {
              blockHash: parent.blockHash,
              requestKey: parent.requestKey,
            },
          });
        }
      },
    }),
  }),
});
