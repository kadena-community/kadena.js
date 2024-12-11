import { prismaClient } from '@db/prisma-client';
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
import type {
  IFungibleAccount,
  IFungibleChainAccount,
} from '../types/graphql-types';
import {
  FungibleAccountName,
  FungibleChainAccountName,
} from '../types/graphql-types';

const keysToCamel = <T extends Record<string, unknown>>(obj: T) => {
  return Object.keys(obj).reduce(
    (acc, key) => {
      acc[key.replace(/_(\w)/g, (m, p1) => p1.toUpperCase())] = obj[key];
      return acc;
    },
    {} as Record<string, unknown>,
  );
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
) => {
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

        const result = await prismaClient.$queryRaw`
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
        `;

        return result;
      } else if (condition !== undefined && condition.take < 0) {
        // Last page: fetch bottom `-take` results in ascending order, then reorder DESC
        log('take negative, "last page"');
        const positiveTake = -condition.take;

        const result = await prismaClient.$queryRaw`
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
        `;

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

      const result = await prismaClient.$queryRaw`
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
      `;

      return result;
    } else {
      // Backward pagination with cursor (take < 0)
      const positiveTake = -condition.take;
      log('condition is negative, page back, take:', positiveTake);
      log('condition', condition);

      const result = await prismaClient.$queryRaw`
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
      `;

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
            ).filter(
              (chainAccount) => chainAccount !== null,
            ) as IFungibleChainAccount[];
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
          try {
            return await prismaClient.transaction.count({
              where: {
                senderAccount: parent.accountName,
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
                senderAccount: parent.accountName,
              },
              orderBy: [{ height: 'desc' }, { creationTime: 'desc' }],
            });
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
              (await getTransfers(
                parent.accountName,
                parent.fungibleName,
                condition,
              )) as any
            ).map(keysToCamel);

            return result;
          } catch (error) {
            throw normalizeError(error);
          }
        },
      }),
    }),
  },
);
