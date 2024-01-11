import { prismaClient } from '@db/prisma-client';
import {
  COMPLEXITY,
  getDefaultConnectionComplexity,
} from '@services/complexity';
import { dotenv } from '@utils/dotenv';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import type { Guard } from '../types/graphql-types';
import { FungibleChainAccountName } from '../types/graphql-types';
import FungibleChainAccount from './fungible-chain-account';

export default builder.prismaNode('Block', {
  description:
    'A unit of information that stores a set of verified transactions.',
  id: { field: 'hash' },
  name: 'Block',
  fields: (t) => ({
    // database fields
    hash: t.exposeID('hash'),
    chainId: t.expose('chainId', { type: 'BigInt' }),
    creationTime: t.expose('creationTime', { type: 'DateTime' }),
    epoch: t.expose('epoch', {
      type: 'DateTime',
      description:
        'The moment the difficulty is adjusted to maintain a block validation time of 30 seconds.',
    }),
    height: t.expose('height', { type: 'BigInt' }),
    parentHash: t.exposeString('parentBlockHash'),
    payloadHash: t.exposeString('payloadHash'),
    powHash: t.exposeString('powHash', {
      description: 'The proof of work hash.',
    }),
    predicate: t.exposeString('predicate'),
    minerAccount: t.field({
      type: FungibleChainAccount,
      complexity: COMPLEXITY.FIELD.PRISMA_WITH_RELATIONS,
      resolve: async (parent) => ({
        __typename: FungibleChainAccountName,
        chainId: parent.chainId.toString(),
        accountName: parent.minerAccount,
        fungibleName: 'coin',
        guard: {
          keys: (
            await prismaClient.minerKey.findMany({
              where: {
                blockHash: parent.hash,
              },
            })
          )?.map((x) => x.key),
          predicate: parent.predicate as Guard['predicate'],
        },
        balance: 0,
        transactions: [],
        transfers: [],
      }),
    }),

    // computed fields
    parent: t.prismaField({
      type: 'Block',
      nullable: true,
      complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
      async resolve(__query, parent) {
        try {
          return await prismaClient.block.findUnique({
            where: {
              hash: parent.parentBlockHash,
            },
          });
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),

    // relations
    transactions: t.prismaConnection({
      type: 'Transaction',
      cursor: 'blockHash_requestKey',
      edgesNullable: false,
      complexity: (args) => ({
        field: getDefaultConnectionComplexity({
          first: args.first,
          last: args.last,
        }),
      }),
      async totalCount(parent) {
        try {
          return await prismaClient.transaction.count({
            where: {
              blockHash: parent.hash,
            },
          });
        } catch (error) {
          throw normalizeError(error);
        }
      },
      async resolve(query, parent) {
        try {
          return await prismaClient.transaction.findMany({
            ...query,
            where: {
              blockHash: parent.hash,
            },
            orderBy: {
              height: 'desc',
            },
          });
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),

    confirmationDepth: t.int({
      description: 'The number of blocks that proceed this block.',
      complexity:
        COMPLEXITY.FIELD.PRISMA_WITH_RELATIONS *
        dotenv.MAX_CALCULATED_BLOCK_CONFIRMATION_DEPTH,
      async resolve(parent) {
        try {
          return await getConfirmationDepth(parent.hash);
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),
  }),
});

async function getConfirmationDepth(blockhash: string): Promise<number> {
  const result = await prismaClient.$queryRaw<{ depth: number }[]>`
    WITH RECURSIVE BlockDescendants AS (
      SELECT hash, parent, 0 AS depth
      FROM blocks
      WHERE hash = ${blockhash}
      UNION ALL
      SELECT b.hash, b.parent, d.depth + 1 AS depth
      FROM BlockDescendants d
      JOIN blocks b ON d.hash = b.parent
      WHERE d.depth < ${dotenv.MAX_CALCULATED_BLOCK_CONFIRMATION_DEPTH}
    )
    SELECT MAX(depth) AS depth
    FROM BlockDescendants;
  `;

  if (result.length && result[0].depth) {
    return Number(result[0].depth);
  } else {
    return 0;
  }
}
