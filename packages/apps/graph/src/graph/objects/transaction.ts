import { prismaClient } from '@db/prisma-client';
import { COMPLEXITY } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { nullishOrEmpty } from '@utils/nullish-or-empty';
import { PRISMA, builder } from '../builder';

export default builder.prismaNode('Transaction', {
  description: 'A confirmed transaction.',
  id: { field: 'blockHash_requestKey' },
  select: {},
  fields: (t) => ({
    // database fields
    badResult: t.string({
      description:
        'The JSON stringified error message if the transaction failed.',
      nullable: true,
      select: {
        badResult: true,
      },
      resolve({ badResult }) {
        return nullishOrEmpty(badResult)
          ? undefined
          : JSON.stringify(badResult);
      },
    }),
    chainId: t.expose('chainId', { type: 'BigInt' }),
    code: t.string({
      description:
        'The Pact expressions executed in this transaction when it is an `exec` transaction. For a continuation, this field is `cont`.',
      select: {
        code: true,
      },
      resolve({ code }) {
        return code === null ? JSON.stringify('cont') : JSON.stringify(code);
      },
    }),
    continuation: t.string({
      description:
        'The JSON stringified continuation in the case that it is a continuation.',
      nullable: true,
      select: {
        continuation: true,
      },
      resolve({ continuation }) {
        return nullishOrEmpty(continuation)
          ? undefined
          : JSON.stringify(continuation);
      },
    }),
    creationTime: t.expose('creationTime', { type: 'DateTime' }),
    data: t.string({
      description:
        'The environment data made available to the transaction. Formatted as raw JSON.',
      nullable: true,
      select: {
        data: true,
      },
      resolve({ data }) {
        return nullishOrEmpty(data) ? undefined : JSON.stringify(data);
      },
    }),
    gas: t.expose('gas', { type: 'BigInt' }),
    gasLimit: t.expose('gasLimit', { type: 'BigInt' }),
    gasPrice: t.expose('gasPrice', { type: 'Float' }),
    goodResult: t.string({
      description:
        'The transaction result when it was successful. Formatted as raw JSON.',
      nullable: true,
      select: {
        goodResult: true,
      },
      resolve({ goodResult }) {
        return nullishOrEmpty(goodResult)
          ? undefined
          : JSON.stringify(goodResult);
      },
    }),
    height: t.expose('height', {
      type: 'BigInt',
      description: 'The height of the block this transaction belongs to.',
    }),
    logs: t.exposeString('logs', {
      nullable: true,
      description:
        'Identifier to retrieve the logs for the execution of the transaction.',
    }),
    metadata: t.string({
      nullable: true,
      select: {
        metadata: true,
      },
      resolve({ metadata }) {
        return nullishOrEmpty(metadata) ? undefined : JSON.stringify(metadata);
      },
    }),
    nonce: t.exposeString('nonce', { nullable: true }),
    eventCount: t.expose('eventCount', { type: 'BigInt', nullable: true }),
    pactId: t.exposeString('pactId', {
      nullable: true,
      description:
        'In the case of a cross-chain transaction; A unique id when a pact (defpact) is initiated. See the "Pact execution scope and pact-id" explanation in the docs for more information.',
    }),
    proof: t.exposeString('proof', {
      nullable: true,
      description:
        'In the case of a cross-chain transaction; the proof provided to continue the cross-chain transaction.',
    }),
    requestKey: t.exposeString('requestKey'),
    rollback: t.expose('rollback', {
      type: 'Boolean',
      nullable: true,
      description:
        'In the case of a cross-chain transaction; Whether or not this transaction can be rolled back.',
    }),
    senderAccount: t.exposeString('senderAccount', { nullable: true }),
    step: t.expose('step', {
      type: 'BigInt',
      nullable: true,
      description:
        'The step-number when this is an execution of a `defpact`, aka multi-step transaction.',
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

    signers: t.prismaField({
      type: ['Signer'],
      nullable: true,
      complexity:
        COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS * PRISMA.DEFAULT_SIZE,
      select: {
        requestKey: true,
      },
      async resolve(query, parent) {
        try {
          return await prismaClient.signer.findMany({
            ...query,
            where: {
              requestKey: parent.requestKey,
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
