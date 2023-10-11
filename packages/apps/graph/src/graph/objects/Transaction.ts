import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

export default builder.prismaNode('Transaction', {
  id: { field: 'blockHash_requestKey' },
  fields: (t) => ({
    // database fields
    badResult: t.string({
      nullable: true,
      resolve({ badResult }) {
        return badResult === undefined || badResult === null || badResult === ''
          ? undefined
          : JSON.stringify(badResult);
      },
    }),
    chainId: t.expose('chainId', { type: 'BigInt' }),
    code: t.exposeString('code', { nullable: true }),
    continuation: t.string({
      nullable: true,
      resolve({ continuation }) {
        return continuation === undefined ||
          continuation === null ||
          continuation === ''
          ? undefined
          : JSON.stringify(continuation);
      },
    }),
    creationTime: t.expose('creationTime', { type: 'DateTime' }),
    data: t.string({
      nullable: true,
      resolve({ data }) {
        return data === undefined || data === null || data === ''
          ? undefined
          : JSON.stringify(data);
      },
    }),
    gas: t.expose('gas', { type: 'BigInt' }),
    gasLimit: t.expose('gasLimit', { type: 'BigInt' }),
    gasPrice: t.expose('gasPrice', { type: 'Float' }),
    goodResult: t.string({
      nullable: true,
      resolve({ goodResult }) {
        return goodResult === undefined ||
          goodResult === null ||
          goodResult === ''
          ? undefined
          : JSON.stringify(goodResult);
      },
    }),
    height: t.expose('height', { type: 'BigInt' }),
    logs: t.exposeString('logs', { nullable: true }),
    metadata: t.string({
      nullable: true,
      resolve({ metadata }) {
        return metadata === undefined || metadata === null || metadata === ''
          ? undefined
          : JSON.stringify(metadata);
      },
    }),
    nonce: t.exposeString('nonce', { nullable: true }),
    eventCount: t.expose('eventCount', { type: 'BigInt', nullable: true }),
    pactId: t.exposeString('pactId', { nullable: true }),
    proof: t.exposeString('proof', { nullable: true }),
    requestKey: t.exposeString('requestKey'),
    rollback: t.expose('rollback', { type: 'Boolean', nullable: true }),
    sender: t.exposeString('sender', { nullable: true }),
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
      // eslint-disable-next-line @typescript-eslint/typedef
      resolve(query, parent, args, context, info) {
        return prismaClient.block.findUnique({
          where: {
            hash: parent.blockHash,
          },
        });
      },
    }),

    events: t.prismaField({
      type: ['Event'],
      nullable: true,
      // eslint-disable-next-line @typescript-eslint/typedef
      resolve(query, parent, args, context, info) {
        return prismaClient.event.findMany({
          where: {
            requestKey: parent.requestKey,
            blockHash: parent.blockHash,
          },
        });
      },
    }),
  }),
});
