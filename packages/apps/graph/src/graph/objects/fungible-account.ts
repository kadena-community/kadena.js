import { prismaClient } from '@db/prisma-client';
import type { Transaction, Transfer } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { getFungibleChainAccount } from '@services/account-service';
import {
  COMPLEXITY,
  getDefaultConnectionComplexity,
} from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { networkData } from '@utils/network';
import { builder } from '../builder';
import { fungibleAccountDetailsLoader } from '../data-loaders/fungible-account-details';

import { dotenv } from '@utils/dotenv';
import { isDefined } from '@utils/isDefined';
import type { IFungibleAccount } from '../types/graphql-types';
import {
  FungibleAccountName,
  FungibleChainAccountName,
} from '../types/graphql-types';

type SnakeToCamel<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? `${Head}${Capitalize<SnakeToCamel<Tail>>}`
  : S;

type CamelCasedProperties<T> =
  T extends Array<infer U>
    ? Array<CamelCasedProperties<U>>
    : T extends object
      ? {
          [K in keyof T as K extends string
            ? SnakeToCamel<K>
            : K]: CamelCasedProperties<T[K]>;
        }
      : T;

type ConvertKeysToCamelCase = <T extends object>(
  obj: T,
) => CamelCasedProperties<T>;

const keysToCamel: ConvertKeysToCamelCase = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key.replace(/_(\w)/g, (m, p1) => p1.toUpperCase())] = (obj as any)[key];
    return acc;
  }, {} as any);
};

interface ITransferQueryConditions {
  select?: Record<string, boolean>;
  take: number;
  skip: number;
  cursor?: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    blockHash_chainId_orderIndex_moduleHash_requestKey?: {
      blockHash: string;
      chainId: number | bigint;
      orderIndex: number | bigint;
      moduleHash: string;
      requestKey: string;
    };
  };
}

const isDev = dotenv.NODE_ENV !== 'production';
const log = isDev ? console.log : () => {};

export const getTransfers = async (
  accountName: string,
  fungibleName: string,
  condition: ITransferQueryConditions,
): Promise<Transfer[]> => {
  try {
    // Handle cases without a cursor
    if (!condition.cursor) {
      log('no cursor condition');
      log('skip', condition?.skip);
      log('take', condition?.take);

      if (condition && (condition.take === 0 || condition.take === undefined)) {
        // use default value for take
        condition.take = 20;
      }

      if (condition !== undefined && condition.take > 0) {
        // First page: just fetch top `take` results from both directions in DESC order
        log('take positive, "first page"');

        const result = (await prismaClient.$queryRaw`
          WITH results AS (
            (
              SELECT *
              FROM "transfers"
              WHERE "modulename" = ${fungibleName}
                AND "from_acct" = ${accountName}
              ORDER BY "height" DESC, "chainid" DESC, "requestkey" DESC, "idx" DESC
            )
            UNION ALL
            (
              SELECT *
              FROM "transfers"
              WHERE "modulename" = ${fungibleName}
                AND "to_acct" = ${accountName}
              ORDER BY "height" DESC, "chainid" DESC, "requestkey" DESC, "idx" DESC
            )
          )
          SELECT
            "block" AS "block_hash",
            "requestkey" AS "request_key",
            "chainid" AS "chain_id",
            "height" AS "height",
            "idx" AS "order_index",
            "modulename" AS "module_name",
            "modulehash" AS "module_hash",
            "from_acct" AS "sender_account",
            "to_acct" AS "receiver_account",
            "amount" AS "amount"
          FROM results
          ORDER BY "height" DESC, "chainid" DESC, "requestkey" DESC, "idx" DESC
          OFFSET ${condition.skip}
          LIMIT ${condition.take}
          ;
        `) as Transfer[];

        return result;
      } else if (condition !== undefined && condition.take < 0) {
        // Last page: fetch bottom `-take` results in ascending order, then reorder DESC
        log('take negative, "last page"');
        const positiveTake = -condition.take;

        const result = (await prismaClient.$queryRaw`
          WITH results AS (
            (
              SELECT *
              FROM "transfers"
              WHERE "modulename" = ${fungibleName}
                AND "from_acct" = ${accountName}
              ORDER BY "height" ASC, "chainid" ASC, "requestkey" ASC, "idx" ASC
              LIMIT ${positiveTake}
            )
            UNION ALL
            (
              SELECT *
              FROM "transfers"
              WHERE "modulename" = ${fungibleName}
                AND "to_acct" = ${accountName}
              ORDER BY "height" ASC, "chainid" ASC, "requestkey" ASC, "idx" ASC
              LIMIT ${positiveTake}
            )
          )
          SELECT
            "block" AS "block_hash",
            "requestkey" AS "request_key",
            "chainid" AS "chain_id",
            "height" AS "height",
            "idx" AS "order_index",
            "modulename" AS "module_name",
            "modulehash" AS "module_hash",
            "from_acct" AS "sender_account",
            "to_acct" AS "receiver_account",
            "amount" AS "amount"
          FROM results
          ORDER BY "height" DESC, "chainid" DESC, "requestkey" DESC, "idx" DESC
          OFFSET ${condition.skip}
          LIMIT ${positiveTake}
          ;
        `) as Transfer[];

        return result;
      }

      return [];
    }

    // Handle cases with a cursor
    const { blockHash, chainId, orderIndex, moduleHash, requestKey } =
      condition.cursor.blockHash_chainId_orderIndex_moduleHash_requestKey!;

    if (condition.take >= 0) {
      // Forward pagination with cursor (take > 0)
      log('condition positive, next page forward');
      log('cursor', condition.cursor);

      const result = (await prismaClient.$queryRaw`
        WITH cursor_row AS (
          SELECT "height","chainid","requestkey","idx"
          FROM "transfers"
          WHERE (block, chainid, idx, modulehash, requestkey) = (
            ${blockHash}, ${chainId}, ${orderIndex}, ${moduleHash}, ${requestKey}
          )
        ),
       results AS (
            (
              SELECT *
              FROM "transfers"
              WHERE "modulename" = ${fungibleName}
                AND "from_acct" = ${accountName}
                AND ("height","chainid","requestkey","idx") <=
                  (SELECT "height","chainid","requestkey","idx" FROM cursor_row)
              ORDER BY "height" DESC, "chainid" DESC, "requestkey" DESC, "idx" DESC
              LIMIT ${condition.take}
            )
            UNION ALL
            (
              SELECT *
              FROM "transfers"
              WHERE "modulename" = ${fungibleName}
                AND "to_acct" = ${accountName}
                AND ("height","chainid","requestkey","idx") <=
                  (SELECT "height","chainid","requestkey","idx" FROM cursor_row)
              ORDER BY "height" DESC, "chainid" DESC, "requestkey" DESC, "idx" DESC
              LIMIT ${condition.take}
            )
          )
        SELECT
          "block" AS "block_hash",
          "requestkey" AS "request_key",
          "chainid" AS "chain_id",
          "height" AS "height",
          "idx" AS "order_index",
          "modulename" AS "module_name",
          "modulehash" AS "module_hash",
          "from_acct" AS "sender_account",
          "to_acct" AS "receiver_account",
          "amount" AS "amount"
        FROM results
        WHERE ("height","chainid","requestkey","idx") <= (
          SELECT "height","chainid","requestkey","idx" FROM cursor_row
        )
        ORDER BY "height" DESC, "chainid" DESC, "requestkey" DESC, "idx" DESC
        OFFSET ${condition.skip}
        LIMIT ${condition.take};
      `) as Transfer[];

      return result;
    } else {
      // Backward pagination with cursor (take < 0)
      const positiveTake = -condition.take;
      log('condition is negative, page back, take:', positiveTake);
      log('condition', condition);

      const result = (await prismaClient.$queryRaw`
        WITH cursor_row AS (
          SELECT "height","chainid","requestkey","idx"
          FROM "transfers"
          WHERE (block, chainid, idx, modulehash, requestkey) = (
            ${blockHash}, ${chainId}, ${orderIndex}, ${moduleHash}, ${requestKey}
          )
        )
        SELECT
          "block" AS "block_hash",
          "requestkey" AS "request_key",
          "chainid" AS "chain_id",
          "height" AS "height",
          "idx" AS "order_index",
          "modulename" AS "module_name",
          "modulehash" AS "module_hash",
          "from_acct" AS "sender_account",
          "to_acct" AS "receiver_account",
          "amount" AS "amount"
         FROM (
          SELECT *
          FROM "transfers"
          WHERE "modulename" = ${fungibleName}
            AND ("from_acct" = ${accountName} OR "to_acct" = ${accountName})
            AND ("height","chainid","requestkey","idx") >= (
              SELECT "height","chainid","requestkey","idx" FROM cursor_row
            )
          ORDER BY "height" ASC, "chainid" ASC, "requestkey" ASC, "idx" ASC
          OFFSET ${condition.skip}
          LIMIT ${positiveTake}
        ) as t0
        ORDER BY "height" DESC, "chainid" DESC, "requestkey" DESC, "idx" DESC
;
      `) as Transfer[];

      return result;
    }
  } catch (error) {
    console.error(error);
    throw normalizeError(error);
  }
};

export const getTransactions = async (
  accountName: string,
  condition: {
    cursor?: {
      blockHash_requestKey?: { blockHash: string; requestKey: string };
    };
    take: number;
    skip: number;
  },
): Promise<Transaction[]> => {
  try {
    if (!condition.cursor) {
      log('no cursor condition');
      log('skip', condition?.skip);
      log('take', condition?.take);

      if (condition && (condition.take === 0 || condition.take === undefined)) {
        condition.take = 20;
      }

      if (condition !== undefined && condition.take > 0) {
        log('take positive, "first page"');

        const result = (await prismaClient.$queryRaw`
          SELECT badresult AS "bad_result",
            block AS "block_hash",
            chainid AS "chain_id",
            code,
            continuation,
            creationtime AS "creation_time",
            data,
            gas,
            gaslimit AS "gas_limit",
            gasprice AS "gas_price",
            goodresult AS "good_result",
            height,
            logs,
            nonce,
            num_events AS "event_count",
            pactid AS "pact_id",
            proof,
            requestkey AS "request_key",
            rollback,
            sender AS "sender_account",
            step,
            ttl,
            txid AS "transaction_id"
          FROM "transactions"
          WHERE "sender" = ${accountName}
          ORDER BY "height" DESC, "creationtime" DESC
          OFFSET ${condition.skip}
          LIMIT ${condition.take}
        `) as Transaction[];

        return result;
      } else if (condition !== undefined && condition.take < 0) {
        log('take negative, "last page"');
        const positiveTake = -condition.take;

        const result = (await prismaClient.$queryRaw`
          SELECT badresult AS "bad_result",
            block AS "block_hash",
            chainid AS "chain_id",
            code,
            continuation,
            creationtime AS "creation_time",
            data,
            gas,
            gaslimit AS "gas_limit",
            gasprice AS "gas_price",
            goodresult AS "good_result",
            height,
            logs,
            nonce,
            num_events AS "event_count",
            pactid AS "pact_id",
            proof,
            requestkey AS "request_key",
            rollback,
            sender AS "sender_account",
            step,
            ttl,
            txid AS "transaction_id"
          FROM "transactions"
          WHERE "sender" = ${accountName}
          ORDER BY "height" ASC, "creationtime" ASC
          OFFSET ${condition.skip}
          LIMIT ${positiveTake}
        `) as Transaction[];

        return result;
      }

      return [];
    }

    if (!condition.cursor.blockHash_requestKey) {
      throw new Error('cursor is missing blockHash_requestKey');
    }

    const { blockHash, requestKey } = condition.cursor.blockHash_requestKey;

    if (condition.take >= 0) {
      log('condition positive, next page forward');
      log('cursor', condition.cursor);

      const result = (await prismaClient.$queryRaw`
        WITH cursor_row AS (
          SELECT "height", "creationtime"
          FROM "transactions"
          WHERE (block, requestkey) = (
            ${blockHash}, ${requestKey}
          )
        )
        SELECT badresult AS "bad_result",
          block AS "block_hash",
          chainid AS "chain_id",
          code,
          continuation,
          creationtime AS "creation_time",
          data,
          gas,
          gaslimit AS "gas_limit",
          gasprice AS "gas_price",
          goodresult AS "good_result",
          height,
          logs,
          nonce,
          num_events AS "event_count",
          pactid AS "pact_id",
          proof,
          requestkey AS "request_key",
          rollback,
          sender AS "sender_account",
          step,
          ttl,
          txid AS "transaction_id"
        FROM "transactions"
        WHERE "sender" = ${accountName}
          AND ("height", "creationtime") <= (
            SELECT "height", "creationtime" FROM cursor_row
          )
        ORDER BY "height" DESC, "creationtime" DESC
        OFFSET ${condition.skip}
        LIMIT ${condition.take}
      `) as Transaction[];

      return result;
    } else {
      const positiveTake = -condition.take;
      log('condition is negative, page back, take:', positiveTake);
      log('condition', condition);

      const result = (await prismaClient.$queryRaw`
        WITH cursor_row AS (
          SELECT "height", "creationtime"
          FROM "transactions"
          WHERE (block, requestkey) = (
            ${blockHash}, ${requestKey}
          )
        )
        SELECT badresult AS "bad_result",
          block AS "block_hash",
          chainid AS "chain_id",
          code,
          continuation,
          creationtime AS "creation_time",
          data,
          gas,
          gaslimit AS "gas_limit",
          gasprice AS "gas_price",
          goodresult AS "good_result",
          height,
          logs,
          nonce,
          num_events AS "event_count",
          pactid AS "pact_id",
          proof,
          requestkey AS "request_key",
          rollback,
          sender AS "sender_account",
          step,
          ttl,
          txid AS "transaction_id"
        FROM (
          SELECT *
          FROM "transactions"
          WHERE "sender" = ${accountName}
            AND ("height", "creationtime") >= (
              SELECT "height", "creationtime" FROM cursor_row
            )
          ORDER BY "height" ASC, "creationtime" ASC
          OFFSET ${condition.skip}
          LIMIT ${positiveTake}
        ) as t0
        ORDER BY "height" DESC, "creationtime" DESC
      `) as Transaction[];

      return result;
    }
  } catch (error) {
    console.error(error);
    throw normalizeError(error);
  }
};

export default builder.node(
  builder.objectRef<IFungibleAccount>(FungibleAccountName),
  {
    description: 'A fungible-specific account.',
    id: {
      resolve: (parent) =>
        JSON.stringify([parent.fungibleName, parent.accountName]),
      parse: (id) => ({
        fungibleName: JSON.parse(id)[0],
        accountName: JSON.parse(id)[1],
      }),
    },
    isTypeOf(source) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (source as any).__typename === FungibleAccountName;
    },

    async loadOne({ fungibleName, accountName }) {
      try {
        return {
          __typename: FungibleAccountName,
          accountName,
          fungibleName,
          chainAccounts: [],
          totalBalance: 0,
          transactions: [],
          transfers: [],
        };
      } catch (error) {
        throw normalizeError(error);
      }
    },
    fields: (t) => ({
      accountName: t.exposeString('accountName'),
      fungibleName: t.exposeString('fungibleName'),
      chainAccounts: t.field({
        type: [FungibleChainAccountName],
        complexity: {
          field: COMPLEXITY.FIELD.CHAINWEB_NODE,
        },

        async resolve(parent) {
          try {
            return (
              await Promise.all(
                networkData.chainIds.map((chainId) => {
                  return getFungibleChainAccount({
                    chainId,
                    fungibleName: parent.fungibleName,
                    accountName: parent.accountName,
                  });
                }),
              )
            ).filter(isDefined);
          } catch (error) {
            throw normalizeError(error);
          }
        },
      }),
      totalBalance: t.field({
        type: 'Decimal',
        complexity: {
          field: COMPLEXITY.FIELD.CHAINWEB_NODE,
        },

        async resolve(parent) {
          try {
            return (
              await Promise.all(
                networkData.chainIds.map(async (chainId) => {
                  return fungibleAccountDetailsLoader.load({
                    fungibleName: parent.fungibleName,
                    accountName: parent.accountName,
                    chainId: chainId,
                  });
                }),
              )
            ).reduce((acc, accountDetails) => {
              if (accountDetails !== null) {
                return acc + accountDetails.balance;
              }
              return acc;
            }, 0);
          } catch (error) {
            throw normalizeError(error);
          }
        },
      }),
      transactions: t.prismaConnection({
        description: 'Default page size is 20.',
        type: Prisma.ModelName.Transaction,
        cursor: 'blockHash_requestKey',
        edgesNullable: false,
        complexity: (args) => ({
          field: getDefaultConnectionComplexity({
            withRelations: true,
            first: args.first,
            last: args.last,
          }),
        }),

        async totalCount(parent) {
          return prismaClient.transaction.count({
            where: {
              senderAccount: parent.accountName,
            },
          });
          // return prismaClient.$queryRaw`
          //   SELECT COUNT(*) as "totalCount"
          //   FROM "transactions"
          //   WHERE "sender" = ${parent.accountName}
          // `;
        },

        async resolve(condition, parent) {
          try {
            // return await prismaClient.transaction.findMany({
            //   ...condition,
            //   where: {
            //     senderAccount: parent.accountName,
            //   },
            //   orderBy: [{ height: 'desc' }, { creationTime: 'desc' }],
            // });

            const result = (
              (await getTransactions(parent.accountName, condition)) as any
            ).map(keysToCamel);

            return result;
          } catch (error) {
            throw normalizeError(error);
          }
        },
      }),
      transfers: t.prismaConnection({
        description: 'Default page size is 20.',
        type: Prisma.ModelName.Transfer,
        cursor: 'blockHash_chainId_orderIndex_moduleHash_requestKey',
        edgesNullable: false,
        complexity: (args) => ({
          field: getDefaultConnectionComplexity({
            first: args.first,
            last: args.last,
          }),
        }),

        async resolve(condition, parent) {
          try {
            const result = (
              await getTransfers(
                parent.accountName,
                parent.fungibleName,
                condition,
              )
            ).map(keysToCamel) as any;

            return result;
          } catch (error) {
            throw normalizeError(error);
          }
        },
      }),
    }),
  },
);
