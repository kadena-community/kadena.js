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

interface IFundExistingAccountOnTestnetCommandInput {
  account: string;
  amount: number;
  chainId: ChainId;
  signerKeys: string[];
  faucetAccount?: string;
  /**
   * compatible contract with "faucet" module
   */
  contract?: string;
}

/**
 * @alpha
 */
export const fundExistingAccountOnTestnetCommand = ({
  account,
  amount,
  chainId,
  signerKeys,
  faucetAccount = 'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA',
  contract = 'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet',
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
    setMeta({ senderAccount: faucetAccount, chainId }),
    setNetworkId('testnet04'),
  );
/**
 * @alpha
 */
export const fundExistingAccountOnTestnet = (
  inputs: Omit<IFundExistingAccountOnTestnetCommandInput, 'signerKeys'>,
) => {
  const keyPair = genKeyPair();
  submitClient<
    PactReturnType<
      IPactModules['n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet']['request-coin']
    >
  >({ sign: createSignWithKeypair(keyPair) })(
    fundExistingAccountOnTestnetCommand({
      ...inputs,
      signerKeys: [keyPair.publicKey],
    }),
  );
};
