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

const getTransfers = async (
  accountName: string,
  fungibleName: string,
  condition?: ITransferQueryConditions,
) => {
  // The query with the pagination cursor is composed separately
  // as Prisma rightfully does not allow dynamic statements in sql queries
  if (!condition?.cursor) {
    log('no condition');
    if (condition !== undefined && condition.take > 0) {
      log('take positive, "first page"');
      return prismaClient.$queryRaw`
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
  FROM
    (
      (
        SELECT
          *
        FROM
          transfers
        WHERE
          "from_acct" = ${accountName}
          AND "modulename" = ${fungibleName}
        ORDER BY
          "height" DESC,
          "chainid" DESC,
          "requestkey" DESC,
          "idx" DESC
        LIMIT
          ${condition?.take}
      )
      UNION
      ALL (
        SELECT
          *
        FROM
          transfers
        WHERE
          "to_acct" = ${accountName}
          AND "modulename" = ${fungibleName}
        ORDER BY
          "height" DESC,
          "chainid" DESC,
          "requestkey" DESC,
          "idx" DESC
        LIMIT
          ${condition?.take}
      )
      OFFSET ${condition?.skip}
      LIMIT
        ${condition?.take}
    ) AS T0
  ORDER BY
    "height" DESC,
    "chainid" DESC,
    "requestkey" DESC,
    "idx" DESC
;
  `;
    } else if (condition !== undefined && condition.take < 0) {
      log('take negative, "last page"');
      return prismaClient.$queryRaw`
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
  FROM
    (
      (
        SELECT
          *
        FROM
          transfers
        WHERE
          "from_acct" = ${accountName}
          AND "modulename" = ${fungibleName}
        ORDER BY
          "height" ASC,
          "chainid" ASC,
          "requestkey" ASC,
          "idx" ASC
        LIMIT
          ${condition?.take * -1}
      )
      UNION
      ALL (
        SELECT
          *
        FROM
          transfers
        WHERE
          "to_acct" = ${accountName}
          AND "modulename" = ${fungibleName}
        ORDER BY
          "height" ASC,
          "chainid" ASC,
          "requestkey" ASC,
          "idx" ASC
        LIMIT
          ${condition?.take * -1}
      )
      OFFSET ${condition?.skip}
      LIMIT
        ${condition?.take * -1}
    ) AS T0
  ORDER BY
    "height" DESC,
    "chainid" DESC,
    "requestkey" DESC,
    "idx" DESC
;
`;
    }
  } else if (condition.take >= 0) {
    const { blockHash, chainId, orderIndex, moduleHash, requestKey } =
      condition.cursor.blockHash_chainId_orderIndex_moduleHash_requestKey!;
    log('condition positive, page forward');
    log(`Condition: ${JSON.stringify(condition, null, 2)}`);
    return prismaClient.$queryRaw`
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
  FROM
    (
      (
        SELECT
          *
        FROM
          transfers
        WHERE
          "from_acct" = ${accountName}
          AND "modulename" = ${fungibleName}
          AND ("height", "chainid", "requestkey", "idx") <= (
            SELECT
              "height",
              "chainid",
              "requestkey",
              "idx"
            FROM
              "transfers"
            WHERE
              (
                block,
                chainid,
                idx,
                modulehash,
                requestkey
              ) = (
                ${blockHash},
                ${chainId},
                ${orderIndex},
                ${moduleHash},
                ${requestKey}
              )
          )
        ORDER BY
          "height" DESC,
          "chainid" DESC,
          "requestkey" DESC,
          "idx" DESC
        LIMIT
          ${condition?.take}
      )
      UNION
      ALL (
        SELECT
          *
        FROM
          transfers
        WHERE
          "to_acct" = ${accountName}
          AND "modulename" = ${fungibleName}
          AND ("height","chainid", "requestkey", "idx") <= (
            SELECT
              "height",
              "chainid",
              "requestkey",
              "idx"
            FROM
              "transfers"
            WHERE
              (
                block,
                chainid,
                idx,
                modulehash,
                requestkey
              ) = (
                ${blockHash},
                ${chainId},
                ${orderIndex},
                ${moduleHash},
                ${requestKey}
              )
          )
        ORDER BY
          "height" DESC,
          "chainid" ASC,
          "requestkey" ASC,
          "idx" DESC
        LIMIT
          ${condition?.take}
      )
      OFFSET ${condition?.skip}
      LIMIT ${condition?.take}
    ) AS T0
  ORDER BY
    "height" DESC,
    "chainid" DESC,
    "requestkey" DESC,
    "idx" DESC
;
`;
  } else {
    const { blockHash, chainId, orderIndex, moduleHash, requestKey } =
      condition.cursor.blockHash_chainId_orderIndex_moduleHash_requestKey!;

    log('condition is negative, page back');
    log(`Condition: ${JSON.stringify(condition, null, 2)}`);

    const res = await prismaClient.$queryRaw`
  WITH target AS (
    SELECT
      "height",
      "chainid",
      "requestkey",
      "idx"
    FROM
      "transfers"
    WHERE
      ("block", "chainid", "idx", "modulehash", "requestkey") = (
        ${blockHash},
        ${chainId},
        ${orderIndex},
        ${moduleHash},
        ${requestKey}
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
    "amount" AS "amount",
    -- "row_number",
    "is_fungible"
  FROM
    (
    SELECT
      *,
      "modulename" = ${fungibleName} AS "is_fungible"
    FROM
    (
      (
        SELECT
          *
        FROM
          "transfers"
        WHERE
          "from_acct" = ${accountName}
        ORDER BY
          "height" ASC,
          "chainid" ASC,
          "requestkey" ASC,
          "idx" ASC
      ) UNION ALL
      (
        SELECT
          *
        FROM
          "transfers"
        WHERE
          "to_acct" = ${accountName}
        ORDER BY
          "height" ASC,
          "chainid" ASC,
          "requestkey" ASC,
          "idx" ASC
      )
     ) as "t0"
     WHERE
      (
        (
          "height",
          "chainid",
          "requestkey",
          "idx"
        ) >= (
          ( SELECT "height" from target as "height" ),
          ( SELECT "chainid" from target as "chainid" ),
          ( SELECT "requestkey" from target as "requestkey" ),
          ( SELECT "idx" from target as "idx" )
        )
      )
      OFFSET ${condition?.skip}
      LIMIT ${condition?.take * -1}
    ) AS "t0"
  WHERE "is_fungible" = true
  ORDER BY
    "height" DESC,
    "chainid" DESC,
    "requestkey" DESC,
    "idx" DESC
  ;
  `;
    return res;
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
