import { prismaClient } from '@src/db/prismaClient';
import { normalizeError } from '@src/utils/errors';
import { nullishOrEmpty } from '@src/utils/nullishOrEmpty';
import { builder } from '../builder';

export default builder.prismaNode('Transaction', {
  id: { field: 'blockHash_requestKey' },
  fields: (t) => ({
    // database fields
    badResult: t.string({
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
      resolve({ code }) {
        return code === null ? JSON.stringify('cont') : JSON.stringify(code);
      },
    }),
    continuation: t.string({
      nullable: true,
      resolve({ continuation }) {
        return nullishOrEmpty(continuation)
          ? undefined
          : JSON.stringify(continuation);
      },
    }),
    creationTime: t.expose('creationTime', { type: 'DateTime' }),
    data: t.string({
      nullable: true,
      resolve({ data }) {
        return nullishOrEmpty(data) ? undefined : JSON.stringify(data);
      },
    }),
    gas: t.expose('gas', { type: 'BigInt' }),
    gasLimit: t.expose('gasLimit', { type: 'BigInt' }),
    gasPrice: t.expose('gasPrice', { type: 'Float' }),
    goodResult: t.string({
      nullable: true,
      resolve({ goodResult }) {
        return nullishOrEmpty(goodResult)
          ? undefined
          : JSON.stringify(goodResult);
      },
    }),
    height: t.expose('height', { type: 'BigInt' }),
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
    step: t.expose('step', { type: 'BigInt', nullable: true }),
    ttl: t.expose('ttl', { type: 'BigInt' }),
    transactionId: t.expose('transactionId', {
      type: 'BigInt',
      nullable: true,
    }),

    // relations
    block: t.prismaField({
      type: 'Block',
      nullable: true,
      async resolve(__query, parent) {
        try {
          return await prismaClient.block.findUnique({
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
      async resolve(__query, parent) {
        try {
          return await prismaClient.event.findMany({
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
      async resolve(__query, parent) {
        try {
          return await prismaClient.transfer.findMany({
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
      async resolve(__query, parent) {
        try {
          return await prismaClient.signer.findMany({
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
