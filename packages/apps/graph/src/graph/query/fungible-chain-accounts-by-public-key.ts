import { prismaClient } from '@db/prisma-client';
import { getFungibleChainAccount } from '@services/account-service';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import FungibleChainAccount from '../objects/fungible-chain-account';
import type { FungibleChainAccount as FungibleChainAccountType } from '../types/graphql-types';

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
    },
    type: [FungibleChainAccount],
    nullable: true,
    async resolve(__parent, args) {
      try {
        const accountNames = await getChainAccountNamesByPublicKey(
          args.publicKey,
          args.chainId,
        );

        if (accountNames.length === 0) {
          return null;
        }

        const fungibleChainAccounts = (
          await Promise.all(
            accountNames.map((accountName: string) => {
              return getFungibleChainAccount({
                chainId: args.chainId,
                fungibleName: 'coin',
                accountName,
              });
            }),
          )
        ).filter(Boolean) as FungibleChainAccountType[];

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
): Promise<string[]> {
  const searchPubKey = `%${publicKey}%`;

  const regex = /^[a-zA-Z0-9]+$/;

  if (publicKey.length !== 64 || !regex.test(publicKey)) {
    throw new Error('Invalid public key');
  }

  const result = (await prismaClient.$queryRaw`
    SELECT DISTINCT to_acct
    FROM transfers AS tr
    INNER JOIN transactions AS tx
      ON tx.block = tr.block AND tx.requestkey = tr.requestkey
    WHERE
      tx.data::text LIKE ${searchPubKey}
      AND tx.chainid = ${BigInt(chainId)}
      AND
        (tx.code LIKE '%coin.transfer-create%'
        OR tx.code LIKE '%coin.create-account%')
  `) as { to_acct: string }[];

  if (result.length === 0) {
    return [];
  }

  return result.map((account) => account.to_acct);
}
