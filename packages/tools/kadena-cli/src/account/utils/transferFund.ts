import type { ICommandResult } from '@kadena/client';
import {
  Pact,
  createClient,
  createSignWithKeypair,
  isSignedTransaction,
} from '@kadena/client';
import { genKeyPair } from '@kadena/cryptography-utils';
import { PactNumber } from '@kadena/pactjs';
import type { ChainId } from '@kadena/types';
import { GAS_STATIONS_MAP, NAMESPACES_MAP } from '../../constants/account.js';
import { DEFAULT_CONTRACT_NAME } from '../../devnet/faucet/deploy/constants.js';
import type { INetworkCreateOptions } from '../../networks/utils/networkHelpers.js';

export async function transferFund({
  receiverAccount,
  config,
}: {
  receiverAccount: {
    name: string;
  };
  config: {
    amount: string;
    contract: string;
    chainId: ChainId;
    networkConfig: INetworkCreateOptions;
  };
}): Promise<ICommandResult | string> {
  try {
    const { chainId, amount, networkConfig } = config;
    const keyPair = genKeyPair();
    const NAMESPACE = NAMESPACES_MAP[networkConfig.networkId];
    const FAUCET_ACCOUNT = GAS_STATIONS_MAP[networkConfig.networkId];

    const transaction = Pact.builder
      .execution(
        // @ts-ignore
        Pact.modules[`${NAMESPACE}.${DEFAULT_CONTRACT_NAME}`]['request-coin'](
          receiverAccount.name,
          new PactNumber(amount).toPactDecimal(),
        ),
      )
      .addSigner(keyPair.publicKey, (withCapability) => [
        withCapability(
          `${NAMESPACE}.${DEFAULT_CONTRACT_NAME}.GAS_PAYER`,
          receiverAccount.name,
          { int: 1 },
          { decimal: '1.0' },
        ),
        withCapability(
          'coin.TRANSFER',
          FAUCET_ACCOUNT,
          receiverAccount.name,
          new PactNumber(amount).toPactDecimal(),
        ),
      ])
      .setMeta({ senderAccount: FAUCET_ACCOUNT, chainId })
      .setNetworkId(networkConfig.networkId)
      .createTransaction();

    const signWithKeyPair = createSignWithKeypair([{ ...keyPair }]);

    const signedTx = await signWithKeyPair(transaction);

    if (!isSignedTransaction(signedTx)) {
      throw new Error('Transaction is not signed');
    }

    const { submit, listen } = createClient(
      `${networkConfig.networkHost}/chainweb/0.0/${networkConfig.networkId}/chain/${chainId}/pact`,
    );

    const requestKeys = await submit(signedTx);

    const response = await listen(requestKeys);

    return response;
  } catch (error) {
    throw new Error(error.message);
  }
}
