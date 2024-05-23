import { prismaClient } from '@db/prisma-client';
import type { Block } from '@prisma/client';
import { Prisma } from '@prisma/client';
import {
  COMPLEXITY,
  getDefaultConnectionComplexity,
} from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { networkData } from '@utils/network';
import { builder } from '../builder';
import type { IGuard } from '../types/graphql-types';
import { FungibleChainAccountName } from '../types/graphql-types';
import FungibleChainAccount from './fungible-chain-account';

const BlockNeighbor = builder.objectType('BlockNeighbor', {
  description: 'The neighbor of a block.',
  fields: (t) => ({
    chainId: t.exposeString('chainId'),
    blockHash: t.exposeString('blockHash'),
  }),
});

export default builder.prismaNode(Prisma.ModelName.Block, {
  description:
    'A unit of information that stores a set of verified transactions.',
  id: { field: 'hash' },
  select: {},
  fields: (t) => ({
    // database fields
    hash: t.exposeString('hash'),
    chainId: t.expose('chainId', { type: 'BigInt' }),
    creationTime: t.expose('creationTime', { type: 'DateTime' }),
    epoch: t.expose('epoch', {
      type: 'DateTime',
      description:
        'The moment the difficulty is adjusted to maintain a block validation time of 30 seconds.',
    }),
    height: t.expose('height', { type: 'BigInt' }),
    payloadHash: t.exposeString('payloadHash'),
    powHash: t.exposeString('powHash', {
      description: 'The proof of work hash.',
    }),
    target: t.expose('target' as never, { type: 'Decimal' }),
    weight: t.expose('weight' as never, { type: 'Decimal' }),
    nonce: t.expose('nonce' as never, { type: 'Decimal' }),
    flags: t.expose('flags' as never, { type: 'Decimal' }),
    minerAccount: t.field({
      type: FungibleChainAccount,
      complexity: COMPLEXITY.FIELD.PRISMA_WITH_RELATIONS,
      select: {
        chainId: true,
        minerAccount: true,
        hash: true,
        predicate: true,
      },
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
              select: {
                key: true,
              },
            })
          )?.map((x) => x.key),
          predicate: parent.predicate as IGuard['predicate'],
        },
        balance: 0,
        transactions: [],
        transfers: [],
      }),
    }),

    // computed fields
    parent: t.prismaField({
      type: Prisma.ModelName.Block,
      nullable: true,
      complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
      select: {
        parentBlockHash: true,
      },
      async resolve(query, parent) {
        try {
          return await prismaClient.block.findUnique({
            ...query,
            where: {
              hash: parent.parentBlockHash,
            },
          });
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),

    neighbours: t.field({
      type: [BlockNeighbor],
      select: {
        chainId: true,
        height: true,
      },
      async resolve(parent) {
        try {
          const neighbours = networkData.chainNeighbours.get(
            parent.chainId.toString(),
          ) as string[];

          const blocks = await prismaClient.block.findMany({
            where: {
              chainId: {
                in: neighbours.map((x) => BigInt(x)),
              },
              height: parent.height - 1n,
            },
          });

          return blocks.map((block) => ({
            chainId: block.chainId.toString(),
            blockHash: block.hash,
          }));
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),

    difficulty: t.field({
      type: 'BigInt',
      select: {
        target: true,
      },
      description: 'The difficulty of the block.',
      resolve: (parent) => 2n ** 256n / BigInt(parent.target.round().toFixed()),
    }),

    // relations
    transactions: t.prismaConnection({
      type: Prisma.ModelName.Transaction,
      description: 'Default page size is 20.',
      cursor: 'blockHash_requestKey',
      edgesNullable: false,
      complexity: (args) => ({
        field: getDefaultConnectionComplexity({
          first: args.first,
          last: args.last,
        }),
      }),
      select: {
        hash: true,
      },
      async totalCount(parent) {
        try {
          return await prismaClient.transaction.count({
            where: {
              blockHash: (parent as Block).hash,
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
              blockHash: (parent as Block).hash,
            },
          });
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),

    events: t.prismaConnection({
      description: 'Default page size is 20.',
      type: Prisma.ModelName.Event,
      cursor: 'blockHash_orderIndex_requestKey',
      edgesNullable: false,
      complexity: (args) => ({
        field: getDefaultConnectionComplexity({
          first: args.first,
          last: args.last,
        }),
      }),
      select: {
        events: true,
      },
      async totalCount(parent) {
        try {
          return (
            parent as Prisma.BlockGetPayload<{ select: { events: true } }>
          ).events.length;
        } catch (error) {
          throw normalizeError(error);
        }
      },
      async resolve(__query, parent) {
        try {
          return (
            parent as Prisma.BlockGetPayload<{ select: { events: true } }>
          ).events;
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),
  }),
});
