import { prismaClient } from '@db/prismaClient';
import { COMPLEXITY } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { nullishOrEmpty } from '@utils/nullishOrEmpty';
import { PRISMA, builder } from '../builder';

export default builder.prismaNode('Transaction', {
  description: 'A request to execute a smart contract function.',
  id: { field: 'blockHash_requestKey' },
  fields: (t) => ({
    // database fields
    badResult: t.string({
      description:
        'The JSON stringified error message if the transaction failed.',
      nullable: true,
      resolve({ badResult }) {
        return nullishOrEmpty(badResult)
          ? undefined
          : JSON.stringify(badResult);
      },
    }),
    chainId: t.expose('chainId', { type: 'BigInt' }),
    // code: t.exposeString('code', { nullable: true }),
    code: t.string({
      description: 'The PACT code that is executed.',
      resolve({ code }) {
        return code === null ? JSON.stringify('cont') : JSON.stringify(code);
      },
    }),
    continuation: t.string({
      description:
        'The JSON stringified continuation in the case that it is a continuation.',
      nullable: true,
      resolve({ continuation }) {
        return nullishOrEmpty(continuation)
          ? undefined
          : JSON.stringify(continuation);
      },
    }),
    creationTime: t.expose('creationTime', { type: 'DateTime' }),
    data: t.string({
      description: 'The JSON stringified data that is related to the request.',
      nullable: true,
      resolve({ data }) {
        return nullishOrEmpty(data) ? undefined : JSON.stringify(data);
      },
    }),
    gas: t.expose('gas', { type: 'BigInt' }),
    gasLimit: t.expose('gasLimit', { type: 'BigInt' }),
    gasPrice: t.expose('gasPrice', { type: 'Float' }),
    goodResult: t.string({
      description:
        'The JSON stringified result if the transaction was successful.',
      nullable: true,
      resolve({ goodResult }) {
        return nullishOrEmpty(goodResult)
          ? undefined
          : JSON.stringify(goodResult);
      },
    }),
    height: t.expose('height', {
      type: 'BigInt',
      description: 'The block height.',
    }),
    logs: t.exposeString('logs', { nullable: true }),
    metadata: t.string({
      nullable: true,
      resolve({ metadata }) {
        return nullishOrEmpty(metadata) ? undefined : JSON.stringify(metadata);
      },
    }),
    nonce: t.exposeString('nonce', { nullable: true }),
    eventCount: t.expose('eventCount', { type: 'BigInt', nullable: true }),
    pactId: t.exposeString('pactId', { nullable: true }),
    proof: t.exposeString('proof', { nullable: true }),
    requestKey: t.exposeString('requestKey'),
    rollback: t.expose('rollback', { type: 'Boolean', nullable: true }),
    senderAccount: t.exposeString('senderAccount', { nullable: true }),
    step: t.expose('step', {
      type: 'BigInt',
      nullable: true,
      description: 'The step number in the case that transactions are chained.',
    }),
    ttl: t.expose('ttl', { type: 'BigInt' }),
    transactionId: t.expose('transactionId', {
      type: 'BigInt',
      nullable: true,
    }),

    // relations
    block: t.prismaField({
      type: 'Block',
      nullable: true,
      complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
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
      async resolve(query, parent) {
        try {
          return await prismaClient.event.findMany({
            ...query,
            where: {
              requestKey: parent.requestKey,
              blockHash: parent.blockHash,
            },
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
      async resolve(query, parent) {
        try {
          return await prismaClient.transfer.findMany({
            ...query,
            where: {
              requestKey: parent.requestKey,
              blockHash: parent.blockHash,
            },
          });
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),

    signers: t.prismaField({
      type: ['Signer'],
      nullable: true,
      complexity:
        COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS * PRISMA.DEFAULT_SIZE,
      async resolve(query, parent) {
        try {
          return await prismaClient.signer.findMany({
            ...query,
            where: {
              requestKey: parent.requestKey,
            },
          });
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),
  }),
});
