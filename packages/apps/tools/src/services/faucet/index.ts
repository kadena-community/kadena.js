import type { Network } from '@/constants/kadena';
import { env } from '@/utils/env';
import type { INetworkData } from '@/utils/network';
import { getApiHost } from '@/utils/network';
import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import type { ITransactionDescriptor } from '@kadena/client';
import { createClient, isSignedTransaction, Pact } from '@kadena/client';
import { genKeyPair, sign } from '@kadena/cryptography-utils';
import { PactNumber } from '@kadena/pactjs';
import Debug from 'debug';

let FAUCET_ACCOUNT = env(
  'FAUCET_USER',
  'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA',
);

const debug = Debug('kadena-transfer:services:faucet');

let NAMESPACE = env(
  'FAUCET_NAMESPACE',
  'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49',
);
const CONTRACT_NAME = env('FAUCET_CONTRACT', 'coin-faucet');
// Helps with TS
const DEFAULT_MODULE_NAME =
  'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet';

export const fundExistingAccount = async (
  account: string,
  chainId: ChainwebChainId,
  network: Network,
  networksData: INetworkData[],
  amount = 100,
): Promise<ITransactionDescriptor> => {
  debug(fundExistingAccount.name);
  const keyPair = genKeyPair();

  const networkDto = networksData.find((item) => item.networkId === network);

  if (!networkDto) {
    throw new Error('Network not found');
  }

  if (network === 'testnet05') {
    NAMESPACE = 'n_f17eb6408bb84795b1c871efa678758882a8744a';
    FAUCET_ACCOUNT = 'c:rpb80hScMYbI_fc8VKzaxcUVCj6s0Bw-iTQvo2Uq50g';
  }

  const transaction = Pact.builder
    .execution(
      Pact.modules[
        `${NAMESPACE}.${CONTRACT_NAME}` as typeof DEFAULT_MODULE_NAME
      ]['request-coin'](account, new PactNumber(amount).toPactDecimal()),
    )
    .addSigner(keyPair.publicKey, (withCapability) => [
      withCapability(
        // @ts-ignore
        `${NAMESPACE}.${CONTRACT_NAME}.GAS_PAYER`,
        account,
        { int: 1 },
        { decimal: '1.0' },
      ),
      withCapability(
        'coin.TRANSFER',
        FAUCET_ACCOUNT,
        account,
        new PactNumber(amount).toPactDecimal(),
      ),
    ])
    .setMeta({ senderAccount: FAUCET_ACCOUNT, chainId })
    .setNetworkId(networkDto.networkId)
    .createTransaction();

  const signature = sign(transaction.cmd, keyPair);

  if (signature.sig === undefined) {
    throw new Error('Failed to sign transaction');
  }

  const apiHost = getApiHost({
    api: networkDto.API,
    networkId: networkDto.networkId,
    chainId,
  });

  transaction.sigs = [{ sig: signature.sig }];

  const { submit } = createClient(apiHost);

  if (!isSignedTransaction(transaction)) {
    throw new Error('Transaction is not signed');
  }

  return await submit(transaction);
};

export const pollResult = async (
  chainId: ChainwebChainId,
  network: Network,
  networksData: INetworkData[],
  requestKeys: ITransactionDescriptor,
) => {
  const networkDto = networksData.find((item) => item.networkId === network);

  if (!networkDto) {
    throw new Error('Network not found');
  }

  const apiHost = getApiHost({
    api: networkDto.API,
    networkId: networkDto.networkId,
    chainId,
  });
  const { pollStatus } = createClient(apiHost);

  return pollStatus(requestKeys);
};
