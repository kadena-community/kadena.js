import type { Signer } from '@prisma/client';
import type { Signer as GQLSigner } from '../types/graphql-types';

export function prismaSignerMapper(prismaSigner: Signer): GQLSigner {
  return {
    publicKey: prismaSigner.publicKey,
    requestKey: prismaSigner.requestKey,
    orderIndex: prismaSigner.orderIndex,
    address: prismaSigner.address,
    scheme: prismaSigner.scheme,
    clist: (
      prismaSigner.capabilities as Array<{ args: any[]; name: string }>
    ).map(({ name, args }) => ({
      name,
      args: JSON.stringify(args),
    })),
  };
}

export function prismaSignersMapper(prismaSigners: Signer[]): GQLSigner[] {
  return prismaSigners.map(prismaSignerMapper);
}
