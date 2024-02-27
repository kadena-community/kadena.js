import { prismaClient } from '@db/prisma-client';
import { COMPLEXITY } from '@services/complexity';
import { dotenv } from '@utils/dotenv';
import { normalizeError } from '@utils/errors';
import { PRISMA, builder } from '../builder';

export default builder.prismaNode('Transaction', {
  description: 'A confirmed transaction.',
  id: { field: 'blockHash_requestKey' },
  select: {},

  fields: (t) => ({
    hash: t.exposeString('requestKey'),
    cmd: t.field({
      complexity:
        COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS * PRISMA.DEFAULT_SIZE,
      type: 'TransactionCommand',
      select: {
        senderAccount: true,
        chainId: true,
        gasLimit: true,
        gasPrice: true,
        ttl: true,
        creationTime: true,
        nonce: true,
        pactId: true,
        step: true,
        rollback: true,
        data: true,
        proof: true,
        code: true,
        requestKey: true,
      },
      async resolve(parent) {
        try {
          const signers = await prismaClient.signer.findMany({
            where: {
              requestKey: parent.requestKey,
            },
            take: PRISMA.DEFAULT_SIZE,
          });

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
            networkId: dotenv.NETWORK_ID,
          };
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),
    result: t.field({
      type: 'TransactionResult',
      select: {
        badResult: true,
        continuation: true,
        gas: true,
        goodResult: true,
        height: true,
        logs: true,
        metadata: true,
        eventCount: true,
        transactionId: true,
      },
      resolve(parent) {
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
        };
      },
    }),
    // relations
    block: t.prismaField({
      type: 'Block',
      nullable: true,
      complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
      select: {
        blockHash: true,
      },
      async resolve(query, parent) {
        try {
          return await prismaClient.block.findUnique({
            ...query,
            where: {
              hash: parent.blockHash,
            },
          });
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),

    events: t.prismaField({
      type: ['Event'],
      nullable: true,
      complexity:
        COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS * PRISMA.DEFAULT_SIZE,
      select: {
        blockHash: true,
        requestKey: true,
      },
      async resolve(query, parent) {
        try {
          return await prismaClient.event.findMany({
            ...query,
            where: {
              requestKey: parent.requestKey,
              blockHash: parent.blockHash,
            },
            take: PRISMA.DEFAULT_SIZE,
          });
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),

    transfers: t.prismaField({
      type: ['Transfer'],
      nullable: true,
      complexity:
        COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS * PRISMA.DEFAULT_SIZE,
      select: {
        blockHash: true,
        requestKey: true,
      },
      async resolve(query, parent) {
        try {
          return await prismaClient.transfer.findMany({
            ...query,
            where: {
              requestKey: parent.requestKey,
              blockHash: parent.blockHash,
            },
            take: PRISMA.DEFAULT_SIZE,
          });
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),
  }),
});
