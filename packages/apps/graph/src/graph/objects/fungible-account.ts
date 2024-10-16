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

const keysToCamel = <T extends Record<string, unknown>>(obj: T) => {
  return Object.keys(obj).reduce(
    (acc, key) => {
      acc[key.replace(/_(\w)/g, (m, p1) => p1.toUpperCase())] = obj[key];
      return acc;
    },
    {} as Record<string, unknown>,
  );
};

import { generateTransferFilter } from '../query/transfers';
import type {
  IFungibleAccount,
  IFungibleChainAccount,
} from '../types/graphql-types';
import {
  FungibleAccountName,
  FungibleChainAccountName,
} from '../types/graphql-types';

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
              orderBy: {
                height: 'desc',
              },
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

        async totalCount(parent) {
          try {
            return await prismaClient.transfer.count({
              where: {
                OR: [
                  {
                    senderAccount: parent.accountName,
                  },
                  {
                    receiverAccount: parent.accountName,
                  },
                ],
                moduleName: parent.fungibleName,
              },
            });
          } catch (error) {
            throw normalizeError(error);
          }
        },

        /*
          amount          Decimal      @db.Decimal
  blockHash       String       @map("block") @db.VarChar
  chainId         BigInt       @map("chainid")
  senderAccount   String       @map("from_acct") @db.VarChar
  height          BigInt
  orderIndex      BigInt       @map("idx")
  moduleHash      String       @map("modulehash") @db.VarChar
  moduleName      String       @map("modulename") @db.VarChar
  requestKey      String       @map("requestkey") @db.VarChar
  receiverAccount String       @map("to_acct") @db.VarChar
        */

        async resolve(condition, parent) {
          console.log('condition', JSON.stringify(condition, null, 2));

          try {
            //             const result = (
            //               (await prismaClient.$queryRaw`
            // WITH tr AS (
            //   -- First subquery: Transfers where the account is the sender
            //   SELECT
            //     amount,
            //     block,
            //     chainid,
            //     from_acct,
            //     height,
            //     idx,
            //     modulehash,
            //     modulename,
            //     requestkey,
            //     to_acct
            //   FROM transfers
            //   WHERE from_acct = ${parent.accountName}
            //     -- AND (:minHeight IS NULL OR height >= :minHeight)
            //     -- AND (:maxHeight IS NULL OR height <= :maxHeight)

            //   UNION

            //   -- Second subquery: Transfers where the account is the receiver
            //   SELECT
            //     amount,
            //     block,
            //     chainid,
            //     from_acct,
            //     height,
            //     idx,
            //     modulehash,
            //     modulename,
            //     requestkey,
            //     to_acct
            //   FROM transfers
            //   WHERE to_acct = ${parent.accountName}
            //   AND from_acct != ${parent.accountName}
            //     -- AND (:minHeight IS NULL OR height >= :minHeight)
            //     -- AND (:maxHeight IS NULL OR height <= :maxHeight)
            // )
            // SELECT
            //   amount,
            //   block AS block_hash,
            //   chainid AS chain_id,
            //   from_acct AS sender_account,
            //   height,
            //   idx AS order_index,
            //   modulehash AS module_hash,
            //   modulename AS module_name,
            //   requestkey AS request_key,
            //   to_acct AS receiver_account
            // FROM tr
            // -- WHERE modulename = :tspToken
            //   -- AND (:tspChainId IS NULL OR chainid = :tspChainId)
            // ORDER BY
            //   height DESC
            // LIMIT 20;
            // `) as any
            //             ).map(keysToCamel);

            const result = await prismaClient.transfer.findMany({
              ...condition,
              where: generateTransferFilter({
                accountName: parent.accountName,
              }),
              orderBy: {
                height: 'desc',
              },
            });
            console.log('result', JSON.stringify(result, null, 2));
            return result;
          } catch (error) {
            throw normalizeError(error);
          }
        },
      }),
    }),
  },
);


const createTransfersPaginatedQuery = () => {
  return prismaClient.$queryRaw`
  WITH transfers_by_acct AS (
	SELECT
		*
	FROM
		(
			SELECT
				*
			FROM
				transfers
			WHERE
				from_acct = 'k:22fbc926b497bf3ecc7199b923039e74cdeda12726e1dc4f443953007cf8cc43'
			ORDER BY
				height DESC,
				requestkey DESC,
				idx ASC
		) as t0
	UNION
	ALL
	SELECT
		*
	FROM
		(
			SELECT
				*
			FROM
				transfers
			WHERE
				to_acct = 'k:22fbc926b497bf3ecc7199b923039e74cdeda12726e1dc4f443953007cf8cc43'
			ORDER BY
				height DESC,
				requestkey DESC,
				idx ASC
		) AS t1
)
SELECT
	amount,
	block AS block_hash,
	chainid AS chain_id,
	from_acct AS sender_account,
	height,
	idx AS order_index,
	modulehash AS module_hash,
	modulename AS module_name,
	requestkey AS request_key,
	to_acct AS receiver_account
FROM
	transfers_by_acct
WHERE
	(
		"height" <= (
			SELECT
				"height"
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
					'I_Oyt-xi7BdmO9hsATRClofuFE-OpVKAFYtT6Vk8oXc',
					1,
					0,
					'rE7DU8jlQL9x_MPYuniZJf5ICBTAEHAIFQCB4blofP4',
					'-gE_ZELs7JDixNbvLkfgUy6d0DR-3c54SJe7SG-Xm3A'
				)
		)
	)
ORDER BY
	height DESC,
	requestkey DESC,
	idx ASC OFFSET 100
LIMIT
	100;`
}
