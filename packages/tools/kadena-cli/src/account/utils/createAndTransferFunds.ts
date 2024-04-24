import type { ChainId, ITransactionDescriptor } from '@kadena/client';
import {
  Pact,
  createClient,
  createSignWithKeypair,
  isSignedTransaction,
  readKeyset,
} from '@kadena/client';
import { genKeyPair } from '@kadena/cryptography-utils';
import { PactNumber } from '@kadena/pactjs';
import {
  GAS_STATIONS_MAP,
  MAINNET_FUND_TRANSFER_ERROR_MESSAGE,
  NAMESPACES_MAP,
} from '../../constants/account.js';
import { DEFAULT_CONTRACT_NAME } from '../../devnet/faucet/deploy/constants.js';
import type { INetworkCreateOptions } from '../../networks/utils/networkHelpers.js';

export async function createAndTransferFund({
  account,
  config,
}: {
  account: {
    name: string;
    publicKeys: string[];
    predicate: string;
  };
  config: {
    amount: string;
    contract: string;
    chainId: ChainId;
    networkConfig: Pick<INetworkCreateOptions, 'networkId' | 'networkHost'>;
  };
}): Promise<ITransactionDescriptor> {
  try {
    const { chainId, amount, networkConfig } = config;

    if (networkConfig.networkId.includes('mainnet')) {
      throw new Error(
        `${MAINNET_FUND_TRANSFER_ERROR_MESSAGE} "${networkConfig.networkId}"`,
      );
    }

    const KEYSET_NAME = 'new_keyset';
    const { name: accountName, publicKeys, predicate } = account;
    const keyPair = genKeyPair();
    const NAMESPACE = NAMESPACES_MAP[networkConfig.networkId];
    const FAUCET_ACCOUNT = GAS_STATIONS_MAP[networkConfig.networkId];
    const FAUCET_CONTRACT = `${NAMESPACE}.${DEFAULT_CONTRACT_NAME}`;

    const transaction = Pact.builder
      .execution(
        // @ts-ignore
        Pact.modules[FAUCET_CONTRACT]['create-and-request-coin'](
          accountName,
          readKeyset(KEYSET_NAME),
          new PactNumber(amount).toPactDecimal(),
        ),
      )
      .addSigner(keyPair.publicKey, (withCapability) => [
        withCapability(
          `${FAUCET_CONTRACT}.GAS_PAYER`,
          accountName,
          { int: 1 },
          { decimal: '1.0' },
        ),
        withCapability(
          'coin.TRANSFER',
          FAUCET_ACCOUNT,
          accountName,
          new PactNumber(amount).toPactDecimal(),
        ),
      ])
      .addKeyset(KEYSET_NAME, predicate, ...publicKeys)
      .setMeta({ senderAccount: FAUCET_ACCOUNT, chainId })
      .setNetworkId(networkConfig.networkId)
      .createTransaction();

    const signWithKeyPair = createSignWithKeypair([keyPair]);

    const signedTx = await signWithKeyPair(transaction);

    if (!isSignedTransaction(signedTx)) {
      throw new Error('Transaction is not signed');
    }

    const { submit, local } = createClient(
      `${networkConfig.networkHost}/chainweb/0.0/${networkConfig.networkId}/chain/${chainId}/pact`,
    );

    // Validate the transaction locally before sending it to the network
    const localResult = await local(signedTx);
    if (localResult.result.status === 'failure') {
      throw localResult.result.error;
    }

    return await submit(signedTx);
  } catch (error) {
    throw Error(
      `Failed to create an account and transfer fund: ${error.message}`,
    );
  }
}
