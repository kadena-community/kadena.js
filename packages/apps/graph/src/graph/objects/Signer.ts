import { nullishOrEmpty } from '@/utils/nullishOrEmpty';
import { builder } from '../builder';

export default builder.prismaNode('Signer', {
  id: { field: 'orderIndex_requestKey' },
  fields: (t) => ({
    //database fields
    address: t.exposeString('address', { nullable: true }),
    capabilities: t.string({
      nullable: true,
      resolve({ capabilities }) {
        return nullishOrEmpty(capabilities)
          ? undefined
          : JSON.stringify(capabilities);
      },
    }),
    orderIndex: t.exposeInt('orderIndex'),
    publicKey: t.exposeString('publicKey'),
    requestKey: t.exposeString('requestKey'),
    scheme: t.exposeString('scheme', { nullable: true }),
    signature: t.exposeString('signature'),
  }),
});
