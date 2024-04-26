import { prismaClient } from '@db/prisma-client';
import { getFungibleChainAccount } from '@services/account-service';
import { chainIds } from '@utils/chains';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import FungibleAccount from '../objects/fungible-account';
import type { FungibleChainAccount } from '../types/graphql-types';
import { FungibleAccountName } from '../types/graphql-types';

builder.queryField('fungibleAccountsByPublicKey', (t) =>
  t.field({
    description: 'Retrieve an account by public key.',
    args: {
      publicKey: t.arg.string({
        required: true,
        validate: {
          minLength: 1,
        },
      }),
      fungibleName: t.arg.string({
        required: false,
        validate: {
          minLength: 1,
        },
      }),
    },
    type: [FungibleAccount],
    async resolve(__parent, args) {
      try {
        const accountAndFungibleNames =
          await getAccountAndFungibleNamesByPublicKey(
            args.publicKey,
            args.fungibleName,
          );

        if (accountAndFungibleNames.length === 0) {
          return [];
        }

        const fungibleAccounts = await Promise.all(
          accountAndFungibleNames.map(async (accountAndFungibleName) => {
            const chainAccounts = (
              await Promise.all(
                chainIds.map((chainId) =>
                  getFungibleChainAccount({
                    chainId: chainId,
                    fungibleName: accountAndFungibleName.fungiblename,
                    accountName: accountAndFungibleName.accountname,
                  }),
                ),
              )
            ).filter(Boolean) as FungibleChainAccount[];

            return {
              __typename: FungibleAccountName,
              accountName: accountAndFungibleName.accountname,
              fungibleName: accountAndFungibleName.fungiblename,
              chainAccounts,
              totalBalance: 0,
              transactions: [],
              transfers: [],
            };
          }),
        );

        return fungibleAccounts;
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);

async function getAccountAndFungibleNamesByPublicKey(
  publicKey: string,
  fungible?: string | null,
): Promise<{ accountname: string; fungiblename: string }[]> {
  const regex = /^[a-zA-Z0-9]+$/;

  if (publicKey.length !== 64 || !regex.test(publicKey)) {
    throw new Error('Invalid public key');
  }

  let results;

  // This is required because prisma queryRaw does not support string interpolation for entire query fragments.
  if (fungible) {
    results = (await prismaClient.$queryRaw`
    SELECT DISTINCT to_acct AS accountname, moduleName as fungiblename
    FROM transfers AS tr
    INNER JOIN transactions AS tx
      ON tx.block = tr.block AND tx.requestkey = tr.requestkey
    WHERE
    tx.data::text LIKE ${`%${publicKey}%`}
      AND
      (tx.code LIKE ${`%${fungible}.transfer-create%`}
        OR tx.code LIKE ${`%${fungible}.create-account%`})
      AND tr.moduleName = ${fungible}
  `) as { accountname: string; fungiblename: string }[];
  } else {
    results = (await prismaClient.$queryRaw`
    SELECT DISTINCT to_acct AS accountname, moduleName as fungiblename, code
    FROM transfers AS tr
    INNER JOIN transactions AS tx
      ON tx.block = tr.block AND tx.requestkey = tr.requestkey
    WHERE
      tx.data::text LIKE ${`%${publicKey}%`}
      AND
      (tx.code LIKE ${`%.transfer-create%`}
        OR tx.code LIKE ${`%.create-account%`})
  `) as { accountname: string; fungiblename: string; code: string }[];

    results = results
      .filter(
        (result, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.accountname === result.accountname &&
              t.fungiblename === result.fungiblename,
          ),
      )
      .filter((result) => result.code.includes(result.fungiblename))
      .map(({ accountname, fungiblename }) => ({ accountname, fungiblename }));
  }

  return results;
}
