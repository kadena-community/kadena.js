import { prismaClient } from '../db/prismaClient';

import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import RelayPlugin from '@pothos/plugin-relay';
import { Prisma, Transaction, Transfer } from '@prisma/client';
import {
  BigIntResolver,
  DateTimeResolver,
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
    PositiveFloat: {
      Input: number;
      Output: number;
    };
  };
}

export interface IContext {
  req: IncomingMessage;
}

export interface IAccount {
  id: string
  accountName: string
  transactions: Transaction[]
  transfers: Transfer[]
}

// eslint-disable-next-line @rushstack/typedef-var
export const builder = new SchemaBuilder<
  IDefaultTypesExtension & {
    PrismaTypes: PrismaTypes;
    Context: IContext;
    Objects: {
      Account: IAccount,
    };
  }
>({
  plugins: [RelayPlugin, PrismaPlugin],

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
  ['PositiveFloat', PositiveFloatResolver],
] as const;

// add the custom scalars
SCALARS.forEach(([name, resolver]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  builder.scalarType(name, resolver as ScalarTypeResolver<any, any>);
});
