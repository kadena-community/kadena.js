import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

export default builder.prismaNode('Transfer', {
  id: { field: 'block_chainid_idx_modulehash_requestkey' },
  fields: (t) => ({
/**
   amount     Decimal @db.Decimal
  block      String  @db.VarChar
  chainid    BigInt
  from_acct  String  @db.VarChar
  height     BigInt
  idx        BigInt
  modulehash String  @db.VarChar
  modulename String  @db.VarChar
  requestkey String  @db.VarChar
  to_acct    String  @db.VarChar
  blocks     Block   @relation(fields: [block], references: [hash], onDelete: NoAction, onUpdate: NoAction)
 */

    // database fields
    amount: t.expose('amount', { type: 'Float' }),
    blockHash: t.exposeString('block'),
    chainId: t.expose('chainid', { type: 'BigInt' }),
    fromAccount: t.exposeString('from_acct'),
    height: t.expose('height', { type: 'BigInt' }),
    idx: t.expose('idx', { type: 'BigInt' }),
    moduleHash: t.exposeString('modulehash'),
    moduleName: t.exposeString('modulename'),
    requestKey: t.exposeString('requestkey'),
    toAccount: t.exposeString('to_acct'),

    // relations
    blocks: t.prismaField({
      type: ['Block'],
      // eslint-disable-next-line @typescript-eslint/typedef
      resolve(query, parent, args, context, info) {
        return prismaClient.block.findMany({
          where: {
            hash: parent.block,
          },
        });
      },
    }),
  }),
});
