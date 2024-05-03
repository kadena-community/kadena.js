import { prismaClient } from '@db/prisma-client';
import { getFungibleChainAccount } from '@services/account-service';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import FungibleChainAccount from '../objects/fungible-chain-account';
import type { IFungibleChainAccount } from '../types/graphql-types';

builder.queryField('fungibleChainAccountsByPublicKey', (t) =>
  t.field({
    description: 'Retrieve a chain account by public key.',
    args: {
      publicKey: t.arg.string({
        required: true,
        validate: {
          minLength: 1,
        },
      }),
      chainId: t.arg.string({
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
    type: [FungibleChainAccount],
    async resolve(__parent, args) {
      try {
        const accountAndFungibleNames = await getChainAccountNamesByPublicKey(
          args.publicKey,
          args.chainId,
          args.fungibleName,
        );

        if (accountAndFungibleNames.length === 0) {
          return [];
        }

        const fungibleChainAccounts = (
          await Promise.all(
            accountAndFungibleNames.map((accountAndFungibleName) => {
              return getFungibleChainAccount({
                chainId: args.chainId,
                fungibleName: accountAndFungibleName.fungiblename,
                accountName: accountAndFungibleName.accountname,
              });
            }),
          )
        ).filter(Boolean) as IFungibleChainAccount[];

        return fungibleChainAccounts;
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);

async function getChainAccountNamesByPublicKey(
  publicKey: string,
  chainId: string,
  fungible?: string | null,
): Promise<{ accountname: string; fungiblename: string }[]> {
  const regex = /^[a-zA-Z0-9]+$/;

  if (publicKey.length !== 64 || !regex.test(publicKey)) {
    throw new Error('Invalid public key');
  }

  // This is required because prisma queryRaw does not support string interpolation for entire query fragments.
  if (fungible) {
    return (await prismaClient.$queryRaw`
    SELECT DISTINCT to_acct AS accountname, moduleName as fungiblename
    FROM transfers AS tr
    INNER JOIN transactions AS tx
      ON tx.block = tr.block AND tx.requestkey = tr.requestkey
    WHERE
      tx.data::text LIKE ${`%${publicKey}%`}
      AND tx.chainid = ${BigInt(chainId)}
      AND
        (tx.code LIKE ${`%${fungible}.transfer-create%`}
        OR tx.code LIKE ${`%${fungible}.create-account%`})
      AND tr.moduleName = ${fungible}
  `) as { accountname: string; fungiblename: string }[];
  } else {
    return (await prismaClient.$queryRaw`
    SELECT DISTINCT to_acct AS accountname, moduleName as fungiblename
    FROM transfers AS tr
    INNER JOIN transactions AS tx
      ON tx.block = tr.block AND tx.requestkey = tr.requestkey
    WHERE
      tx.data::text LIKE ${`%${publicKey}%`}
      AND tx.chainid = ${BigInt(chainId)}
      AND
        (tx.code LIKE ${`%.transfer-create%`}
        OR tx.code LIKE ${`%.create-account%`})
  `) as { accountname: string; fungiblename: string }[];
  }
}
