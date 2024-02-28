import { prismaClient } from '@db/prisma-client';
import { getFungibleChainAccount } from '@services/account-service';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import FungibleChainAccount from '../objects/fungible-chain-account';

builder.queryField('fungibleChainAccountByPublicKey', (t) =>
  t.field({
    description: 'Retrieve a chain account by public key.',
    args: {
      publicKey: t.arg.string({ required: true }),
      chainId: t.arg.string({ required: true }),
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
  const searchPubKey = `%${publicKey}%`;

  const result = (await prismaClient.$queryRaw`
    SELECT to_acct
    FROM transfers AS tr
    INNER JOIN transactions AS tx
      ON tx.block = tr.block AND tx.requestkey = tr.requestkey
    WHERE
      tx.data::text LIKE ${searchPubKey}
      AND tx.chainid = ${BigInt(chainId)}
      AND
        (tx.code LIKE '%coin.transfer-create%'
        OR tx.code LIKE '%coin.create-account%')
    ORDER BY tr.amount DESC
    LIMIT 1
  `) as { to_acct: string }[];

  if (result.length === 0) {
    return undefined;
  }

  return result[0].to_acct;
}
