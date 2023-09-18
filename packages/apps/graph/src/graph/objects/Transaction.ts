import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

export default builder.prismaNode('Transaction', {
  id: { field: 'blockHash_requestkey' },
  fields: (t) => ({
    // database fields
    badResult: t.string({
      nullable: true,
      resolve({ badresult }) {
        return !badresult ? undefined : JSON.stringify(badresult);
      },
    }),
    chainId: t.expose('chainid', { type: 'BigInt' }),
    code: t.exposeString('code', { nullable: true }),
    continuation: t.string({
      nullable: true,
      resolve({ continuation }) {
        return !continuation ? undefined : JSON.stringify(continuation);
      },
    }),
    creationTime: t.expose('creationtime', { type: 'DateTime' }),
    data: t.string({
      nullable: true,
      resolve({ data }) {
        return !data ? undefined : JSON.stringify(data);
      },
    }),
    gas: t.expose('gas', { type: 'BigInt' }),
    gasLimit: t.expose('gaslimit', { type: 'BigInt' }),
    gasPrice: t.expose('gasprice', { type: 'Float' }),
    goodResult: t.string({
      nullable: true,
      resolve({ goodresult }) {
        return !goodresult ? undefined : JSON.stringify(goodresult);
      },
    }),
    height: t.expose('height', { type: 'BigInt' }),
    logs: t.exposeString('logs', { nullable: true }),
    metadata: t.string({
      nullable: true,
      resolve({ metadata }) {
        return !metadata ? undefined : JSON.stringify(metadata);
      },
    }),
    nonce: t.exposeString('nonce', { nullable: true }),
    numEvents: t.expose('num_events', { type: 'BigInt', nullable: true }),
    pactId: t.exposeString('pactid', { nullable: true }),
    proof: t.exposeString('proof', { nullable: true }),
    requestKey: t.exposeString('requestkey'),
    rollback: t.expose('rollback', { type: 'Boolean', nullable: true }),
    sender: t.exposeString('sender', { nullable: true }),
    step: t.expose('step', { type: 'BigInt', nullable: true }),
    ttl: t.expose('ttl', { type: 'BigInt' }),
    txId: t.expose('txid', { type: 'BigInt', nullable: true }),

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
            requestkey: parent.requestkey,
            blockHash: parent.blockHash,
          },
        });
      },
    }),
  }),
});
