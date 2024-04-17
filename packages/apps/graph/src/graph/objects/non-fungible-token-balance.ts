import { getTokenInfo } from '@devnet/simulation/marmalade/get-token-info';
import type { ChainId } from '@kadena/types';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import { tokenDetailsLoader } from '../data-loaders/token-details';
import type { NonFungibleTokenBalance } from '../types/graphql-types';
import { NonFungibleTokenBalanceName } from '../types/graphql-types';
import NonFungibleToken from './non-fungible-token';

export default builder.node(
  builder.objectRef<NonFungibleTokenBalance>(NonFungibleTokenBalanceName),
  {
    description: 'The token identifier and its balance.',
    id: {
      resolve: (parent) =>
        JSON.stringify([parent.tokenId, parent.accountName, parent.chainId]),
      parse: (id) => ({
        tokenId: JSON.parse(id)[0],
        accountName: JSON.parse(id)[1],
        chainId: JSON.parse(id)[2],
      }),
    },
    isTypeOf(source) {
      return (source as any).__typename === NonFungibleTokenBalanceName;
    },
    async loadOne({ tokenId, accountName, chainId }) {
      try {
        return (
          await tokenDetailsLoader.load({
            accountName,
            chainId,
          })
        ).find((token) => token.tokenId === tokenId);
      } catch (error) {
        throw normalizeError(error);
      }
    },
    fields: (t) => ({
      accountName: t.exposeString('accountName'),
      tokenId: t.exposeString('tokenId'),
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
            return await getTokenInfo(
              parent.tokenId,
              parent.chainId.toString() as ChainId,
              parent.version,
            );
          } catch (error) {
            throw normalizeError(error);
          }
        },
      }),
    }),
  },
);
