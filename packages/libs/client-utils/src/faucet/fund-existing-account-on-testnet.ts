import type { ChainId, IPactModules, PactReturnType } from '@kadena/client';
import { Pact, createSignWithKeypair } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';

import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
  setNetworkId,
} from '@kadena/client/fp';

import { genKeyPair } from '@kadena/cryptography-utils';
import { submitClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IFundExistingAccountOnTestnetCommandInput {
  account: string;
  amount: number;
  signerKeys: string[];
  faucetAccount?: string;
  chainId?: ChainId;
  /**
   * compatible contract with "faucet" module
   */
  contract?: string;
  networkId?: string;
}

/**
 * @alpha
 */
export const fundExistingAccountOnTestnetCommand = ({
  account,
  amount,
  signerKeys,
  chainId,
  faucetAccount = 'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA',
  contract = 'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet',
  networkId = 'testnet04',
}: IFundExistingAccountOnTestnetCommandInput) =>
  composePactCommand(
    execution(
      Pact.modules[
        contract as 'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet'
      ]['request-coin'](account, new PactNumber(amount).toPactDecimal()),
    ),
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
    setMeta({ senderAccount: faucetAccount, ...(chainId ? { chainId } : {}) }),
    setNetworkId(networkId),
  );
/**
 * @alpha
 */
export const fundExistingAccountOnTestnet = (
  inputs: Omit<IFundExistingAccountOnTestnetCommandInput, 'signerKeys'>,
  config: Omit<IClientConfig, 'sign'>,
) => {
  const keyPair = genKeyPair();
  submitClient<
    PactReturnType<
      IPactModules['n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet']['request-coin']
    >
  >({ ...config, sign: createSignWithKeypair(keyPair) })(
    fundExistingAccountOnTestnetCommand({
      ...inputs,
      signerKeys: [keyPair.publicKey],
    }),
  );
};
