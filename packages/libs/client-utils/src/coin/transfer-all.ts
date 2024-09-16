import type { ChainId, ISigner } from '@kadena/client';
import { Pact, readKeyset } from '@kadena/client';
import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';

import { estimateGas } from '../core';
import { submitClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';
import { getBalance } from './get-balance';

interface ITransferAllInput {
  sender: { account: string; publicKeys: ISigner[] };
  receiver: {
    account: string;
    keyset: {
      keys: ISigner[];
      pred: 'keys-all' | 'keys-2' | 'keys-any';
    };
  };
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
 */
export const transferAllCommand = ({
  sender,
  receiver,
  amount,
  gasPayer = sender,
  chainId,
  contract = 'coin',
}: ITransferAllInput) =>
  composePactCommand(
    execution(
      Pact.modules[contract as 'coin']['transfer-create'](
        sender.account,
        receiver.account,
        readKeyset('account-guard'),
        () => `(coin.get-balance "${sender.account}")`,
      ),
    ),
    addKeyset(
      'account-guard',
      receiver.keyset.pred,
      ...receiver.keyset.keys.map((key) =>
        typeof key === 'object' ? key.pubKey : key,
      ),
    ),
    addSigner(sender.publicKeys, (signFor) => [
      signFor(
        `${contract as 'coin'}.TRANSFER`,
        sender.account,
        receiver.account,
        {
          decimal: amount,
        },
      ),
    ]),
    addSigner(gasPayer.publicKeys, (signFor) => [signFor('coin.GAS')]),
    setMeta({ senderAccount: gasPayer.account, chainId }),
  );

/**
 * @alpha
 */
export const transferAll = async (
  inputs: Omit<ITransferAllInput, 'amount'>,
  config: IClientConfig,
) => {
  if (
    !config.defaults?.networkId ||
    !config.defaults?.meta?.chainId ||
    !config.host
  ) {
    throw new Error(
      'NetworkId, chainId, and host are required  in config.defaults',
    );
  }
  const balance = await getBalance(
    inputs.receiver.account,
    config.defaults?.networkId,
    config.defaults?.meta?.chainId,
    config.host,
    inputs.contract,
  );

  const command = transferAllCommand({ ...inputs, amount: balance });
  const gas = await estimateGas(command, config.host);
  const updatedCommand = composePactCommand(command, setMeta({ ...gas }));

  return submitClient(config)(updatedCommand);
};
