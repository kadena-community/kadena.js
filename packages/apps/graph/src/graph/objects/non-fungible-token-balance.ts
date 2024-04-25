import { COMPLEXITY } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import { nonFungibleTokenBalancesLoader } from '../data-loaders/non-fungible-token-balances';
import { nonFungibleTokenInfoLoader } from '../data-loaders/non-fungible-token-info';
import type { INonFungibleTokenBalance } from '../types/graphql-types';
import { NonFungibleTokenBalanceName } from '../types/graphql-types';
import Guard from './guard';
import NonFungibleTokenInfo from './non-fungible-token-info';

export default builder.node(
  builder.objectRef<INonFungibleTokenBalance>(NonFungibleTokenBalanceName),
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (source as any).__typename === NonFungibleTokenBalanceName;
    },
    async loadOne({ tokenId, accountName, chainId }) {
      try {
        return (
          await nonFungibleTokenBalancesLoader.load({
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
        type: Guard,
        resolve(parent) {
          return parent.guard;
        },
      }),
      info: t.field({
        type: NonFungibleTokenInfo,
        complexity: COMPLEXITY.FIELD.CHAINWEB_NODE,
        nullable: true,
        async resolve(parent) {
          try {
            const tokenInfo = await nonFungibleTokenInfoLoader.load({
              tokenId: parent.tokenId,
              chainId: parent.chainId,
              version: parent.version,
            });

            return tokenInfo;
          } catch (error) {
            throw normalizeError(error);
          }
        },
      }),
    }),
  },
);
