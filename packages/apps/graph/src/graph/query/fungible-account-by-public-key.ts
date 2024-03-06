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
    type: [FungibleAccount],
    nullable: true,
    async resolve(__parent, args) {
      try {
        const accountNames = await getAccountNamesByPublicKey(args.publicKey);

        if (accountNames.length === 0) {
          return null;
        }

        const accountsWithChainAccounts = await Promise.all(
          accountNames.map(async (accountName: string) => {
            const chainAccounts = (
              await Promise.all(
                chainIds.map((chainId) =>
                  getFungibleChainAccount({
                    chainId: chainId,
                    fungibleName: 'coin',
                    accountName: accountName,
                  }),
                ),
              )
            ).filter(Boolean) as FungibleChainAccount[];

            return {
              __typename: FungibleAccountName,
              accountName,
              fungibleName: 'coin',
              chainAccounts,
              totalBalance: 0,
              transactions: [],
              transfers: [],
            };
          }),
        );

        console.log('returning', accountsWithChainAccounts);
        return accountsWithChainAccounts;
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);

async function getAccountNamesByPublicKey(
  publicKey: string,
): Promise<string[]> {
  const regex = /^[a-zA-Z0-9]+$/;

  if (publicKey.length !== 64 || !regex.test(publicKey)) {
    throw new Error('Invalid public key');
  }

  const searchPubKey = `%${publicKey}%`;

  const accountsFromTransactions = (await prismaClient.$queryRaw`
    SELECT DISTINCT to_acct
    FROM transfers AS tr
    INNER JOIN transactions AS tx
      ON tx.block = tr.block AND tx.requestkey = tr.requestkey
    WHERE
      tx.data::text LIKE ${searchPubKey}
      AND
        (tx.code LIKE '%coin.transfer-create%'
        OR tx.code LIKE '%coin.create-account%')
  `) as { to_acct: string }[];

  const result = accountsFromTransactions.map((account) => account.to_acct);

  if (result.length === 0) {
    return [];
  }

  return result;
}
