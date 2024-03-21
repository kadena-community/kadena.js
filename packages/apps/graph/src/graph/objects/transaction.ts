import { prismaClient } from '@db/prisma-client';
import { Prisma } from '@prisma/client';
import {
  COMPLEXITY,
  getDefaultConnectionComplexity,
} from '@services/complexity';
import { builder } from '../builder';
import { prismaTransactionMapper } from '../mappers/transaction-mapper';
import Block from './block';
import TransactionCommand from './transaction-command';
import TransactionResult from './transaction-info';

export default builder.node('Transaction', {
  description: 'A transaction.',
  id: {
    resolve: (parent) => {
      if ('blockHash' in parent.result) {
        return JSON.stringify([parent.result.blockHash, parent.hash]);
      } else {
        return JSON.stringify([parent.result, parent.hash]);
      }
    },
    parse: (id) => {
      const [blockHash, requestKey] = JSON.parse(id);
      return {
        blockHash,
        requestKey,
      };
    },
  },
  isTypeOf(source) {
    return (source as any).__typename === 'Transaction';
  },
  async loadOne({ blockHash, requestKey }, context) {
    const prismaTransaction = await prismaClient.transaction.findUnique({
      where: {
        blockHash_requestKey: {
          blockHash: blockHash,
          requestKey: requestKey,
        },
      },
    });

    if (!prismaTransaction) return null;

    return {
      __typename: 'Transaction',
      ...(await prismaTransactionMapper(prismaTransaction, context)),
    };
  },
  fields: (t) => ({
    hash: t.exposeString('hash'),
    cmd: t.field({
      complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
      type: TransactionCommand,
      resolve: (parent) => parent.cmd,
    }),
    result: t.field({
      type: TransactionResult,
      resolve: (parent) => parent.result,
    }),
    block: t.field({
      type: Block,
      complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
      nullable: true,
      async resolve(parent) {
        if ('blockHash' in parent.result && parent.result.blockHash) {
          return await prismaClient.block.findUnique({
            where: {
              hash: parent.result.blockHash,
            },
          });
        }
        return null;
      },
    }),
    events: t.prismaConnection({
      description: 'Default page size is 20.',
      type: Prisma.ModelName.Event,
      edgesNullable: false,
      complexity: (args) => ({
        field: getDefaultConnectionComplexity({
          first: args.first,
          last: args.last,
        }),
      }),
      cursor: 'blockHash_orderIndex_requestKey',
      async totalCount(parent) {
        if ('blockHash' in parent.result && parent.result.blockHash) {
          return await prismaClient.event.count({
            where: {
              blockHash: parent.result.blockHash,
              requestKey: parent.hash,
            },
          });
        } else {
          return 0;
        }
      },
      async resolve(query, parent) {
        if ('blockHash' in parent.result && parent.result.blockHash) {
          return await prismaClient.event.findMany({
            ...query,
            where: {
              blockHash: parent.result.blockHash,
              requestKey: parent.hash,
            },
          });
        } else {
          return [];
        }
      },
    }),
    transfers: t.prismaConnection({
      description: 'Default page size is 20.',
      type: Prisma.ModelName.Transfer,
      edgesNullable: false,
      complexity: (args) => ({
        field: getDefaultConnectionComplexity({
          first: args.first,
          last: args.last,
        }),
      }),
      cursor: 'blockHash_chainId_orderIndex_moduleHash_requestKey',
      async totalCount(parent) {
        if ('blockHash' in parent.result && parent.result.blockHash) {
          return await prismaClient.transfer.count({
            where: {
              blockHash: parent.result.blockHash,
              requestKey: parent.hash,
            },
          });
        } else {
          return 0;
        }
      },
      resolve(query, parent) {
        if ('blockHash' in parent.result && parent.result.blockHash) {
          return prismaClient.transfer.findMany({
            ...query,
            where: {
              blockHash: parent.result.blockHash,
              requestKey: parent.hash,
            },
          });
        } else {
          return [];
        }
      },
    }),
  }),
});
