import {
  ChainId,
  createClient,
  createSignWithKeypair,
  isSignedTransaction,
  Pact,
  readKeyset,
} from '@kadena/client';
import { kadenaKeyPairsFromRandom } from '@kadena/hd-wallet';
import { ITransactionDescriptor } from '@kadena/wallet-sdk';

export const NAMESPACES = {
  DEV_NET: 'n_34d947e2627143159ea73cdf277138fd571f17ac',
  TEST_NET: 'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49',
} as const;

export const GAS_STATIONS = {
  DEV_NET: 'c:zWPXcVXoHwkNTzKhMU02u2tzN_yL6V3-XTEH1uJaVY4',
  TEST_NET: 'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA',
} as const;

export const GAS_STATIONS_MAP: { [key: string]: string } = {
  development: GAS_STATIONS.DEV_NET,
  testnet04: GAS_STATIONS.TEST_NET,
} as const;

export const NAMESPACES_MAP: { [key: string]: string } = {
  development: NAMESPACES.DEV_NET,
  testnet04: NAMESPACES.TEST_NET,
};

const DEFAULT_CONTRACT_NAME = 'coin-faucet';

const toPactDecimal = (amount: string) => {
  return { decimal: amount.includes('.') ? amount : `${amount}.0` };
};

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
    networkId: string;
  };
}): Promise<ITransactionDescriptor> {
  try {
    const { chainId, amount, networkId } = config;

    const KEYSET_NAME = 'new_keyset';
    const { name: accountName, publicKeys, predicate } = account;
    const NAMESPACE = NAMESPACES_MAP[networkId];
    const FAUCET_ACCOUNT = GAS_STATIONS_MAP[networkId];
    const FAUCET_CONTRACT = `${NAMESPACE}.${DEFAULT_CONTRACT_NAME}`;
    const [keyPair] = kadenaKeyPairsFromRandom(1);
    const transaction = Pact.builder
      .execution(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (Pact as any).modules[FAUCET_CONTRACT]['create-and-request-coin'](
          accountName,
          readKeyset(KEYSET_NAME),
          toPactDecimal(amount),
        ),
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .addSigner(keyPair.publicKey, (withCapability: any) => [
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
          toPactDecimal(amount),
        ),
      ])
      .addKeyset(KEYSET_NAME, predicate, ...publicKeys)
      .setMeta({ senderAccount: FAUCET_ACCOUNT, chainId })
      .setNetworkId(networkId)
      .createTransaction();

    const signWithKeyPair = createSignWithKeypair([keyPair]);

    const signedTx = await signWithKeyPair(transaction);

    if (!isSignedTransaction(signedTx)) {
      throw new Error('Transaction is not signed');
    }

    const { submit, local } = createClient();

    // Validate the transaction locally before sending it to the network
    const localResult = await local(signedTx);
    if (localResult.result.status === 'failure') {
      throw localResult.result.error;
    }

    return await submit(signedTx);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    throw Error(
      `Failed to create an account and transfer fund: ${error.message}`,
    );
  }
}
