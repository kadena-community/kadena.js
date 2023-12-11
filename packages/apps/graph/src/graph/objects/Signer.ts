import { nullishOrEmpty } from '@utils/nullishOrEmpty';
import { builder } from '../builder';

export default builder.prismaNode('Signer', {
  description: 'A signer for a specific transaction.',
  id: { field: 'requestKey_orderIndex' },
  fields: (t) => ({
    //database fields
    address: t.exposeString('address', {
      nullable: true,
      description: 'The signer for the gas.',
    }),
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
    scheme: t.exposeString('scheme', {
      nullable: true,
      description: 'The signature scheme that was used to sign.',
    }),
    signature: t.exposeString('signature', {
      description:
        'The result of the signing operation of the hash of the transaction.',
    }),
  }),
});
