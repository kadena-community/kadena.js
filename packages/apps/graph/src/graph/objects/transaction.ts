import type { Signer } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { getMempoolTransactionStatus } from '@services/chainweb-node/mempool';
import { normalizeError } from '@utils/errors';
import { networkData } from '@utils/network';
import { nullishOrEmpty } from '@utils/nullish-or-empty';
import { builder } from '../builder';
import { signersLoader } from '../data-loaders/signers';
import TransactionCommand from './transaction-command';
import TransactionInfo from './transaction-result';
import TransactionSigs from './transaction-signature';

export default builder.prismaNode(Prisma.ModelName.Transaction, {
  description: 'A transaction.',
  // We can assume this id field because we never return connections when
  // querying transactions from the mempool
  id: {
    field: 'blockHash_requestKey',
  },
  fields: (t) => ({
    hash: t.exposeString('requestKey'),

    sigs: t.field({
      type: [TransactionSigs],
      async resolve(parent) {
        if (!nullishOrEmpty(parent.blockHash)) {
          const signers = await signersLoader.load({
            blockHash: parent.blockHash,
            requestKey: parent.requestKey,
            chainId: parent.chainId.toString(),
          });

          return signers.map((signer) => ({
            sig: signer.signature,
          }));
        }
        return [];
      },
    }),
    cmd: t.field({
      type: TransactionCommand,
      async resolve(parent, args, context, info) {
        try {
          let signers: Signer[] = [];

          if (!nullishOrEmpty(parent.blockHash)) {
            signers = await signersLoader.load({
              blockHash: parent.blockHash,
              requestKey: parent.requestKey,
              chainId: parent.chainId.toString(),
            });
          }

          return {
            nonce: parent.nonce,
            meta: {
              chainId: parent.chainId,
              gasLimit: parent.gasLimit,
              gasPrice: parent.gasPrice,
              ttl: parent.ttl,
              creationTime: parent.creationTime,
              sender: parent.senderAccount,
            },
            payload: {
              code: JSON.stringify(parent.code),
              data: parent.data ? JSON.stringify(parent.data) : '',
              pactId: parent.pactId,
              step: Number(parent.step),
              rollback: parent.rollback,
              proof: parent.proof,
            },
            signers,
            networkId: networkData.networkId,
          };
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),
    result: t.field({
      type: TransactionInfo,
      async resolve(parent, args, context, info) {
        try {
          //This check is important because a transaction can be completed, yet we can still be able to fetch a status from the mempool
          if (nullishOrEmpty(parent.blockHash)) {
            const status = await getMempoolTransactionStatus(
              parent.requestKey,
              parent.chainId.toString(),
            );

            if (!nullishOrEmpty(status) && status) {
              return {
                status,
              };
            }
          }

          return {
            hash: parent.requestKey,
            chainId: parent.chainId,
            badResult: parent.badResult
              ? JSON.stringify(parent.badResult)
              : null,
            continuation: parent.continuation
              ? JSON.stringify(parent.continuation)
              : null,
            gas: parent.gas,
            goodResult: parent.goodResult
              ? JSON.stringify(parent.goodResult)
              : null,
            height: parent.height,
            logs: parent.logs,
            eventCount: parent.eventCount,
            transactionId: parent.transactionId,
            blockHash: parent.blockHash,
          };
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),
  }),
});
