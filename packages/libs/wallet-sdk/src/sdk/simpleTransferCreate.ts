import type { ChainId, ISigner } from '@kadena/client';
import { transferCreateCommand } from '@kadena/client-utils/coin';

export interface ICreateSimpleTransferInput {
  sender: string;
  receiver: string;
  amount: string;
  gasPayer?: { account: string; publicKeys: ISigner[] };
  chainId: ChainId;
  /**
   * compatible contract with fungible-v2; default is "coin"
   */
  contract?: string;
}

/**
 * transfer create that only supports `k:` accounts for sender and receiver.
 * Accepts either account name or public key
 */
export const simpleTransferCreateCommand = ({
  sender,
  receiver,
  amount,
  gasPayer,
  chainId,
  contract = 'coin',
}: ICreateSimpleTransferInput) => {
  const senderPublicKey = sender.startsWith('k:')
    ? sender.substring(2)
    : sender;
  const senderAccount = `k:${senderPublicKey}`;

  const receiverPublicKey = receiver.startsWith('k:')
    ? receiver.substring(2)
    : receiver;
  const receiverAccount = `k:${receiverPublicKey}`;

  const gasPayerPublicKeys = gasPayer ? gasPayer.publicKeys : [senderPublicKey];
  const gasPayerAccount = gasPayer ? gasPayer.account : senderAccount;

  return transferCreateCommand({
    amount,
    chainId,
    contract,
    gasPayer: {
      account: gasPayerAccount,
      publicKeys: gasPayerPublicKeys,
    },
    receiver: {
      account: receiverAccount,
      keyset: {
        keys: [receiverPublicKey],
        pred: 'keys-all',
      },
    },
    sender: {
      account: senderAccount,
      publicKeys: [senderPublicKey],
    },
  });
};
