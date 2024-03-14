import SchemaBuilder from '@pothos/core';
import ComplexityPlugin from '@pothos/plugin-complexity';
import DataloaderPlugin from '@pothos/plugin-dataloader';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import RelayPlugin from '@pothos/plugin-relay';
import TracingPlugin, { wrapResolver } from '@pothos/plugin-tracing';
import { Prisma } from '@prisma/client';
import { logTrace } from '@services/tracing/trace-service';
import { dotenv } from '@utils/dotenv';
import {
  BigIntResolver,
  DateTimeResolver,
  NonNegativeFloatResolver,
  PositiveFloatResolver,
} from 'graphql-scalars';
import type { IncomingMessage } from 'http';
import { prismaClient } from '../db/prisma-client';
import type {
  CapabilitiesList,
  ContinuationPayload,
  ExecutionPayload,
  FungibleAccount,
  FungibleChainAccount,
  GasLimitEstimation,
  GraphConfiguration,
  Guard,
  MempoolInfo,
  MempoolTransaction,
  NonFungibleAccount,
  NonFungibleChainAccount,
  Signer1,
  Token,
  TokenInfo,
  Transaction1,
  TransactionCommand,
  TransactionCommand1,
  TransactionInfo,
  TransactionMeta,
  TransactionResult,
  TransactionSubscriptionResponse,
} from './types/graphql-types';

interface IDefaultTypesExtension {
  Scalars: {
    BigInt: {
      Input: bigint;
      Output: bigint;
    };
    DateTime: {
      Input: Date;
      Output: Date;
    };
    Decimal: {
      Input: number;
      Output: number;
    };
    PositiveFloat: {
      Input: number;
      Output: number;
    };
  };
}

export interface IContext {
  req: IncomingMessage;
  extensions: any;
  networkId: string;
}

export const PRISMA = {
  DEFAULT_SIZE: 20,
};

// eslint-disable-next-line @rushstack/typedef-var
export const builder = new SchemaBuilder<
  IDefaultTypesExtension & {
    PrismaTypes: PrismaTypes;
    Context: IContext;
    Objects: {
      FungibleAccount: FungibleAccount;
      FungibleChainAccount: FungibleChainAccount;
      GasLimitEstimation: GasLimitEstimation;
      GraphConfiguration: GraphConfiguration;
      Guard: Guard;
      NonFungibleAccount: NonFungibleAccount;
      NonFungibleChainAccount: NonFungibleChainAccount;
      Token: Token;
      TokenInfo: TokenInfo;
      TransactionCommand: TransactionCommand;
      TransactionMeta: TransactionMeta;
      ExecutionPayload: ExecutionPayload;
      ContinuationPayload: ContinuationPayload;
      TransactionResult: TransactionResult;
      TransactionSubscriptionResponse: TransactionSubscriptionResponse;
      MempoolTransaction: MempoolTransaction;
      Transaction1: Transaction1;
      MempoolInfo: MempoolInfo;
      TransactionInfo: TransactionInfo;
      Signer1: Signer1;
      TransactionCommand1: TransactionCommand1;
      CapabilitiesList: CapabilitiesList;
    };
    Connection: {
      totalCount: number;
    };
  }
>({
  plugins: [
    ComplexityPlugin,
    DataloaderPlugin,
    PrismaPlugin,
    RelayPlugin,
    TracingPlugin,
  ],

  prisma: {
    client: prismaClient,
    dmmf: Prisma.dmmf,
    // uses /// comments from schema.prisma as descriptions
    exposeDescriptions: false,
    // use where clause from prismaRelatedConnection for totalCount
    filterConnectionTotalCount: true,
  },

  relayOptions: {
    clientMutationId: 'optional',
    cursorType: 'String',
  },

  ...(dotenv.COMPLEXITY_ENABLED && {
    complexity: {
      limit: {
        complexity: dotenv.COMPLEXITY_LIMIT,
      },
    },
  }),

  ...(dotenv.TRACING_ENABLED && {
    tracing: {
      default: () => true,
      wrap: (resolver, __options, config) => (parent, args, ctx, info) => {
        return wrapResolver(resolver, async (__error, duration) => {
          await logTrace(config.parentType, config.name, duration);

          ctx.extensions.tracing = {
            ...ctx.extensions.tracing,
            [`${config.parentType}.${config.name}`]: duration,
          };
        })(parent, args, ctx, info);
      },
    },
  }),
});

type ScalarTypeResolver<TScalarInputShape, TScalarOutputShape> =
  PothosSchemaTypes.ScalarTypeOptions<
    PothosSchemaTypes.ExtendDefaultTypes<IDefaultTypesExtension>,
    TScalarInputShape,
    TScalarOutputShape
  >;

// Defines the custom scalars
// eslint-disable-next-line @rushstack/typedef-var
const SCALARS = [
  ['BigInt', BigIntResolver],
  ['DateTime', DateTimeResolver],
  ['Decimal', NonNegativeFloatResolver],
  ['PositiveFloat', PositiveFloatResolver],
] as const;

// add the custom scalars
SCALARS.forEach(([name, resolver]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  builder.scalarType(name, resolver as ScalarTypeResolver<any, any>);
});
