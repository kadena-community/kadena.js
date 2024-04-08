import { Prisma } from '@prisma/client';
import { builder } from '../builder';

export default builder.prismaNode(Prisma.ModelName.Signer, {
  description: 'A signer for a specific transaction.',
  id: { field: 'requestKey_orderIndex' },
  fields: (t) => ({
    orderIndex: t.exposeInt('orderIndex', { nullable: true }),
    pubkey: t.exposeString('publicKey'),
    address: t.exposeString('address', {
      nullable: true,
      description: 'The signer for the gas.',
    }),
    scheme: t.exposeString('scheme', {
      nullable: true,
      description: 'The signature scheme that was used to sign.',
    }),
    clist: t.field({
      type: ['TransactionCapability'],
      resolve: (parent) => {
        return (
          parent.capabilities as Array<{ args: any[]; name: string }>
        ).map(({ name, args }) => ({
          name,
          args: JSON.stringify(args),
        }));
      },
    }),
  }),
});
