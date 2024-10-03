import type {
  ChainId,
  IPactModules,
  ISigner,
  PactReturnType,
} from '@kadena/client';
import { Pact, readKeyset } from '@kadena/client';
import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';

import { submitClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface ICreateSimpleTransferInput {
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
 * @alpha
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

  return composePactCommand(
    execution(
      Pact.modules[contract as 'coin']['transfer-create'](
        senderAccount,
        receiverAccount,
        readKeyset('account-guard'),
        {
          decimal: amount,
        },
      ),
    ),
    addKeyset('account-guard', 'keys-all', receiverPublicKey),
    addSigner(senderPublicKey, (signFor) => [
      signFor(
        `${contract as 'coin'}.TRANSFER`,
        senderAccount,
        receiverAccount,
        {
          decimal: amount,
        },
      ),
    ]),
    addSigner(gasPayerPublicKeys, (signFor) => [signFor('coin.GAS')]),
    setMeta({ senderAccount: gasPayerAccount, chainId }),
  );
};

/**
 * @alpha
 */
export const simpleTransferCreate = (
  inputs: ICreateSimpleTransferInput,
  config: IClientConfig,
) =>
  submitClient<PactReturnType<IPactModules['coin']['transfer-create']>>(config)(
    simpleTransferCreateCommand(inputs),
  );
