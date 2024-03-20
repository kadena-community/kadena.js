import { Prisma } from '@prisma/client';
import { COMPLEXITY } from '@services/complexity';
import { builder } from '../builder';
import Block from './block';
import TransactionCommand from './transaction-command';
import TransactionResult from './transaction-info';

export default builder.node('Transaction', {
  description: 'A transaction.',
  id: {
    resolve: (parent) => {
      if ('blockHash' in parent.result) {
        return JSON.stringify([parent.hash, parent.result.blockHash]);
      } else {
        return JSON.stringify([parent.hash, parent.result]);
      }
    },
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
      resolve: async (parent) => parent.block,
    }),
    events: t.prismaConnection({
      description: 'Default page size is 20.',
      type: Prisma.ModelName.Event,
      edgesNullable: false,
      cursor: 'blockHash_orderIndex_requestKey',
      async totalCount(parent, args, context) {
        return parent.events.length;
      },
      resolve(query, parent, args) {
        return parent.events;
      },
    }),
  }),
});
