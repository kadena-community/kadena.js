import { prismaClient } from '@db/prisma-client';
import { getFungibleChainAccount } from '@services/account-service';
import { chainIds } from '@utils/chains';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import FungibleAccount from '../objects/fungible-account';
import type { FungibleChainAccount } from '../types/graphql-types';
import { FungibleAccountName } from '../types/graphql-types';

builder.queryField('fungibleAccountByPublicKey', (t) =>
  t.field({
    description: 'Retrieve an account by public key.',
    args: {
      publicKey: t.arg.string({ required: true }),
    },
    type: FungibleAccount,
    nullable: true,
    async resolve(__parent, args) {
      try {
        const accountName = await getAccountNameByPublicKey(args.publicKey);

        if (!accountName) {
          return null;
        }

        const chainAccounts = (
          await Promise.all(
            chainIds.map(async (chainId) => {
              return getFungibleChainAccount({
                chainId: chainId,
                fungibleName: 'coin',
                accountName: accountName,
              });
            }),
          )
        ).filter(
          (chainAccount) => chainAccount !== null,
        ) as FungibleChainAccount[];

        if (chainAccounts.length === 0) {
          return null;
        }

        return {
          __typename: FungibleAccountName,
          accountName: accountName,
          fungibleName: 'coin',
          chainAccounts,
          totalBalance: 0,
          transactions: [],
          transfers: [],
        };
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);

async function getAccountNameByPublicKey(
  publicKey: string,
): Promise<string | undefined> {
  const searchPubKey = `%${publicKey}%`;

  const result = (await prismaClient.$queryRaw`
    SELECT to_acct, amount
    FROM transfers AS tr
    INNER JOIN transactions AS tx
      ON tx.block = tr.block AND tx.requestkey = tr.requestkey
    WHERE
      tx.data::text LIKE ${searchPubKey}
      AND
        (tx.code LIKE '%coin.transfer-create%'
        OR tx.code LIKE '%coin.create-account%')
    ORDER BY tr.amount DESC
    LIMIT 1
  `) as { to_acct: string; amount: string }[];

  console.log(result);

  if (result.length === 0) {
    return undefined;
  }

  return result[0].to_acct;
}
