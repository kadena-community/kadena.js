import { prismaClient } from '@db/prisma-client';
import { Prisma } from '@prisma/client';
import { COMPLEXITY } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { nullishOrEmpty } from '@utils/nullish-or-empty';
import { builder } from '../builder';

export default builder.prismaNode(Prisma.ModelName.Event, {
  description:
    'An event emitted by the execution of a smart-contract function.',
  id: { field: 'blockHash_orderIndex_requestKey' },
  select: {},
  fields: (t) => ({
    // database fields
    chainId: t.expose('chainId', { type: 'BigInt' }),
    height: t.expose('height', {
      type: 'BigInt',
      description: 'The height of the block where the event was emitted.',
    }),
    orderIndex: t.expose('orderIndex', {
      type: 'BigInt',
      description:
        'The order index of this event, in the case that there are multiple events in one transaction.',
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
    transaction: t.prismaField({
      type: Prisma.ModelName.Transaction,
      nullable: true,
      complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
      select: {
        transaction: true,
        blockHash: true,
        requestKey: true,
      },
      async resolve(query, parent) {
        try {
          return (
            parent.transaction ||
            (await prismaClient.transaction.findUnique({
              ...query,
              where: {
                blockHash_requestKey: {
                  blockHash: parent.blockHash,
                  requestKey: parent.requestKey,
                },
              },
            }))
          );
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
        blockHash: true,
      },
      async resolve(query, parent) {
        try {
          return (
            parent.block ||
            (await prismaClient.block.findUniqueOrThrow({
              ...query,
              where: {
                hash: parent.blockHash,
              },
            }))
          );
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),
  }),
});
