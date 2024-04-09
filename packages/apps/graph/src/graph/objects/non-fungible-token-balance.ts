import { getTokenInfo } from '@devnet/simulation/marmalade/get-token-info';
import type { ChainId } from '@kadena/types';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import NonFungibleToken from './non-fungible-token';

export default builder.objectType('NonFungibleTokenBalance', {
  description: 'The token identifier and its balance.',
  fields: (t) => ({
    id: t.exposeString('id'),
    balance: t.exposeInt('balance'),
    chainId: t.exposeString('chainId'),
    version: t.exposeString('version'),
    guard: t.field({
      type: 'Guard',
      resolve(parent) {
        return parent.guard;
      },
    }),
    info: t.field({
      type: NonFungibleToken,
      nullable: true,
      async resolve(parent) {
        try {
          const tokenInfo = await getTokenInfo(
            parent.id,
            parent.chainId.toString() as ChainId,
            parent.version,
          );

          if (!tokenInfo) {
            return null;
          }

          return tokenInfo;
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),
  }),
});
