import { prismaClient } from '@db/prisma-client';
import { getFungibleChainAccount } from '@services/account-service';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import FungibleChainAccount from '../objects/fungible-chain-account';

builder.queryField('fungibleChainAccountByPublicKey', (t) =>
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
    type: FungibleChainAccount,
    nullable: true,
    async resolve(__parent, args) {
      try {
        const accountName = await getChainAccountNameByPublicKey(
          args.publicKey,
          args.chainId,
        );

        if (!accountName) {
          return null;
        }

        return await getFungibleChainAccount({
          chainId: args.chainId,
          fungibleName: 'coin',
          accountName,
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);

async function getChainAccountNameByPublicKey(
  publicKey: string,
  chainId: string,
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
          chainId: parseInt(chainId),
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
