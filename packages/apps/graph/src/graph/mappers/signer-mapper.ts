import type { Signer } from '@prisma/client';
import type { Signer as GQLSigner } from '../types/graphql-types';

export function prismaSignersMapper(prismaSigners: Signer[]): GQLSigner[] {
  return prismaSigners.map(({ publicKey, address, scheme, capabilities }) => ({
    publicKey,
    address,
    scheme,
    clist: (capabilities as Array<{ args: any[]; name: string }>).map(
      ({ name, args }) => ({
        name,
        args: JSON.stringify(args),
      }),
    ),
  }));
}
