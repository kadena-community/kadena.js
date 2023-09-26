import { prismaClient } from '../db/prismaClient';
import DataloaderPlugin from '@pothos/plugin-dataloader';
import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import RelayPlugin from '@pothos/plugin-relay';
import type { Transaction, Transfer } from '@prisma/client';
import { Prisma } from '@prisma/client';
import {
  BigIntResolver,
  DateTimeResolver,
  NonNegativeFloatResolver,
  PositiveFloatResolver,
} from 'graphql-scalars';
import type { IncomingMessage } from 'http';

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
}

export type IGuard = {
  keys: string[];
  predicate: 'keys-all' | 'keys-any' | 'keys-two';
};

export interface IChainModuleAccount {
  chainId: string;
  moduleName: string;
  accountName: string;
  guard: IGuard;
  balance: number;
  transactions: Transaction[];
  transfers: Transfer[];
}

export interface IModuleAccount {
  id: string;
  moduleName: string;
  accountName: string;
  chainAccounts: IChainModuleAccount[];
  totalBalance: number;
  transactions: Transaction[];
  transfers: Transfer[];
}

// eslint-disable-next-line @rushstack/typedef-var
export const builder = new SchemaBuilder<
  IDefaultTypesExtension & {
    PrismaTypes: PrismaTypes;
    Context: IContext;
    Objects: {
      ModuleAccount: IModuleAccount;
      ChainModuleAccount: IChainModuleAccount;
      Guard: IGuard;
    };
  }
>({
  plugins: [RelayPlugin, PrismaPlugin, DataloaderPlugin],

  relayOptions: {
    clientMutationId: 'optional',
    cursorType: 'String',
  },

  prisma: {
    client: prismaClient,
    dmmf: Prisma.dmmf,
    // uses /// comments from schema.prisma as descriptions
    exposeDescriptions: false,
    // use where clause from prismaRelatedConnection for totalCount
    filterConnectionTotalCount: true,
  },
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
