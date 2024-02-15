import { getTokenInfo } from '@devnet/simulation/marmalade/get-token-info';
import type { ChainId } from '@kadena/types';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';

export default builder.objectType('Token', {
  description: 'The token identifier and its balance.',
  fields: (t) => ({
    id: t.exposeID('id'),
    balance: t.exposeInt('balance'),
    chainId: t.exposeString('chainId'),
    info: t.field({
      type: 'TokenInfo',
      nullable: true,
      async resolve(parent) {
        try {
          const tokenInfo = await getTokenInfo(
            parent.id,
            parent.chainId.toString() as ChainId,
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
