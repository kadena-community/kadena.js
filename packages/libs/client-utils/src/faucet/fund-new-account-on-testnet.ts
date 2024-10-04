import type { ChainId, IPactModules, PactReturnType } from '@kadena/client';
import { Pact, createSignWithKeypair, readKeyset } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';

import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
  setNetworkId,
} from '@kadena/client/fp';

import { genKeyPair } from '@kadena/cryptography-utils';
import { submitClient } from '../core/client-helpers';

interface IFundNewAccountOnTestnetCommandInput {
  account: string;
  keyset: {
    keys: string[];
    pred: 'keys-all' | 'keys-2' | 'keys-any';
  };
  amount: number;
  chainId: ChainId;
  signerKeys: string[];
  faucetAccount?: string;
  /**
   * compatible contract with "faucet" module
   */
  contract?: string;
  networkId?: string;
}

/**
 * @alpha
 */
export const fundNewAccountOnTestnetCommand = ({
  account,
  keyset,
  amount,
  chainId,
  signerKeys,
  faucetAccount = 'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA',
  contract = 'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet',
  networkId = 'testnet04',
}: IFundNewAccountOnTestnetCommandInput) =>
  composePactCommand(
    execution(
      Pact.modules[
        contract as 'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet'
      ]['create-and-request-coin'](
        account,
        readKeyset('account-guard'),
        new PactNumber(amount).toPactDecimal(),
      ),
    ),
    addKeyset('account-guard', keyset.pred, ...keyset.keys),
    addSigner(signerKeys, (signFor) => [
      signFor(
        // @ts-ignore
        `${contract as 'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet'}.GAS_PAYER`,
        account,
        { int: 1 },
        { decimal: '1.0' },
      ),
      signFor(
        'coin.TRANSFER',
        faucetAccount,
        account,
        new PactNumber(amount).toPactDecimal(),
      ),
    ]),
    setMeta({ senderAccount: faucetAccount, chainId }),
    setNetworkId(networkId),
  );
/**
 * @alpha
 */
export const fundNewAccountOnTestnet = (
  inputs: Omit<IFundNewAccountOnTestnetCommandInput, 'signerKeys'>,
) => {
  const keyPair = genKeyPair();
  submitClient<
    PactReturnType<
      IPactModules['n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet']['create-and-request-coin']
    >
  >({ sign: createSignWithKeypair(keyPair) })(
    fundNewAccountOnTestnetCommand({
      ...inputs,
      signerKeys: [keyPair.publicKey],
    }),
  );
};
