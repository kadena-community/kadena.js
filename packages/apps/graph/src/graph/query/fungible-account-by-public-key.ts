import { prismaClient } from '@db/prisma-client';
import { getFungibleChainAccount } from '@services/account-service';
import { chainIds } from '@utils/chains';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import FungibleAccount from '../objects/fungible-account';
import type { IFungibleChainAccount } from '../types/graphql-types';
import { FungibleAccountName } from '../types/graphql-types';

builder.queryField('fungibleAccountByPublicKey', (t) =>
  t.field({
    description: 'Retrieve an account by public key.',
    args: {
      publicKey: t.arg.string({
        required: true,
        validate: {
          minLength: 1,
        },
      }),
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
        ) as IFungibleChainAccount[];

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
  const result = await prismaClient.transaction.findFirst({
    where: {
      AND: [
        {
          code: {
            contains: 'transfer-create',
          },
        },
        {
          data: {
            path: ['account-guard', 'keys'],
            array_contains: publicKey,
          },
        },
        {
          data: {
            path: ['account-guard', 'pred'],
            not: '',
          },
        },
      ],
    },
    select: {
      transfers: {
        select: { receiverAccount: true },
        orderBy: { amount: 'desc' },
        take: 1,
      },
    },
  });

  return result?.transfers[0].receiverAccount;
}
