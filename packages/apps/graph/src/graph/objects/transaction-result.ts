import { prismaClient } from '@db/prisma-client';
import { Prisma } from '@prisma/client';
import {
  COMPLEXITY,
  getDefaultConnectionComplexity,
} from '@services/complexity';
import { nullishOrEmpty } from '@utils/nullish-or-empty';
import { builder } from '../builder';

const TransactionMempoolInfo = builder.objectType('TransactionMempoolInfo', {
  description: 'The mempool information.',
  fields: (t) => ({
    status: t.exposeString('status', {
      description: 'The status of the mempool.',
      nullable: true,
    }),
  }),
});

const TransactionResult = builder.objectType('TransactionResult', {
  description: 'The result of a transaction.',
  fields: (t) => ({
    badResult: t.exposeString('badResult', {
      description:
        'The transaction result when it was successful. Formatted as raw JSON.',
      nullable: true,
    }),
    continuation: t.exposeString('continuation', {
      description:
        'The JSON stringified continuation in the case that it is a continuation.',
      nullable: true,
    }),
    gas: t.expose('gas', { type: 'BigInt' }),
    goodResult: t.exposeString('goodResult', {
      description:
        'The transaction result when it was successful. Formatted as raw JSON.',
      nullable: true,
    }),
    height: t.expose('height', {
      description: 'The height of the block this transaction belongs to.',
      type: 'BigInt',
    }),
    logs: t.exposeString('logs', {
      description:
        'Identifier to retrieve the logs for the execution of the transaction.',
      nullable: true,
    }),
    metadata: t.exposeString('metadata', { nullable: true }),
    eventCount: t.expose('eventCount', { type: 'BigInt', nullable: true }),
    transactionId: t.expose('transactionId', {
      type: 'BigInt',
      nullable: true,
    }),

    // relations
    block: t.prismaField({
      type: Prisma.ModelName.Block,
      complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
      resolve(query, parent) {
        return prismaClient.block.findUniqueOrThrow({
          ...query,
          where: {
            hash: parent.blockHash,
          },
        });
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
        return await prismaClient.event.count({
          where: {
            blockHash: parent.blockHash,
            requestKey: parent.hash,
          },
        });
      },
      async resolve(query, parent) {
        return await prismaClient.event.findMany({
          ...query,
          where: {
            blockHash: parent.blockHash,
            requestKey: parent.hash,
          },
        });
      },
    }),
    transfers: t.prismaConnection({
      type: Prisma.ModelName.Transfer,
      cursor: 'blockHash_chainId_orderIndex_moduleHash_requestKey',
      complexity: (args) => ({
        field: getDefaultConnectionComplexity({
          withRelations: true,
          first: args.first,
          last: args.last,
        }),
      }),
      async totalCount(parent) {
        return await prismaClient.transfer.count({
          where: {
            blockHash: parent.blockHash,
            requestKey: parent.hash,
            chainId: parent.chainId,
          },
        });
      },
      async resolve(query, parent) {
        return await prismaClient.transfer.findMany({
          ...query,
          where: {
            blockHash: parent.blockHash,
            requestKey: parent.hash,
            chainId: parent.chainId,
          },
        });
      },
    }),
  }),
});

export default builder.unionType('TransactionInfo', {
  description: 'The result of a transaction.',
  types: [TransactionResult, TransactionMempoolInfo],
  resolveType(result) {
    if ('status' in result && !nullishOrEmpty(result.status)) {
      return TransactionMempoolInfo.name;
    } else {
      return TransactionResult.name;
    }
  },
});
