import { prismaClient } from '@db/prisma-client';
import type { Transaction } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { COMPLEXITY } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { nullishOrEmpty } from '@utils/nullish-or-empty';
import { PRISMA, builder } from '../builder';
import GQLTransaction from '../objects/transaction';
import { prismaTransactionMapper } from '../utils/transaction-mapper';

export default builder.prismaNode(Prisma.ModelName.Event, {
  description:
    'An event emitted by the execution of a smart-contract function.',
  id: { field: 'blockHash_orderIndex_requestKey' },
  select: {},
  fields: (t) => ({
    // database fields
    incrementedId: t.exposeInt('id'),
    chainId: t.expose('chainId', { type: 'BigInt' }),
    height: t.expose('height', {
      type: 'BigInt',
      description: 'The height of the block where the event was emitted.',
    }),
    orderIndex: t.expose('orderIndex', {
      type: 'BigInt',
      description:
        'The order index of this event, in the case that there are multiple events.',
    }),
    moduleName: t.exposeString('moduleName'),
    name: t.exposeString('name'),
    parameterText: t.exposeString('parameterText'),
    parameters: t.string({
      nullable: true,
      select: {
        parameters: true,
      },
      resolve({ parameters }) {
        return nullishOrEmpty(parameters)
          ? undefined
          : JSON.stringify(parameters);
      },
    }),
    qualifiedName: t.exposeString('qualifiedName', {
      description:
        'The full eventname, containing module and eventname, e.g. coin.TRANSFER',
    }),
    requestKey: t.exposeString('requestKey'),

    //relations
    transaction: t.field({
      type: GQLTransaction,
      nullable: true,
      complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
      select: {
        transactions: true,
      },
      async resolve(__query, parent, context) {
        try {
          if (parent.transaction) {
            const signers = await prismaClient.signer.findMany({
              where: {
                requestKey: (parent.transaction as Transaction).requestKey,
              },
              take: PRISMA.DEFAULT_SIZE,
            });

            return prismaTransactionMapper(
              parent.transaction as Transaction,
              signers,
              context,
            );
          }
          return null;
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),

    block: t.prismaField({
      type: Prisma.ModelName.Block,
      nullable: false,
      complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
      select: {
        block: true,
      },
      async resolve(__query, parent) {
        try {
          return parent.block;
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),
  }),
});
