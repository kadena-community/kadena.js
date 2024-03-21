import { prismaClient } from '@db/prisma-client';
import { builder } from '../builder';
import { prismaSignerMapper } from '../mappers/signer-mapper';

export default builder.node('Signer', {
  description: 'A signer for a specific transaction.',
  id: {
    resolve: (parent) => JSON.stringify([parent.requestKey, parent.orderIndex]),
    parse: (id) => {
      const [requestKey, orderIndex] = JSON.parse(id);
      return {
        requestKey,
        orderIndex,
      };
    },
  },
  async loadOne({ requestKey, orderIndex }) {
    const prismaSigner = await prismaClient.signer.findUnique({
      where: {
        requestKey_orderIndex: {
          requestKey,
          orderIndex,
        },
      },
    });

    if (!prismaSigner) return null;

    return {
      __typename: 'Signer',
      ...prismaSignerMapper(prismaSigner),
    };
  },

  fields: (t) => ({
    requestKey: t.exposeString('requestKey'),
    orderIndex: t.exposeInt('orderIndex', { nullable: true }),
    publicKey: t.exposeString('publicKey'),
    address: t.exposeString('address', {
      nullable: true,
      description: 'The signer for the gas.',
    }),
    scheme: t.exposeString('scheme', {
      nullable: true,
      description: 'The signature scheme that was used to sign.',
    }),
    clist: t.field({
      type: ['CapabilitiesList'],
      resolve: (parent) => parent.clist,
    }),
    signature: t.exposeString('signature', { nullable: true }),
  }),
});
