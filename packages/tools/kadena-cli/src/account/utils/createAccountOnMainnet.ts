import { createSignWithKeypair } from '@kadena/client';
import { createAccount } from '@kadena/client-utils/coin';
import { genKeyPair } from '@kadena/cryptography-utils';
import type { ChainId } from '@kadena/types';
import { networkDefaults } from '../../constants/networks.js';
import type { CommandResult } from '../../utils/command.util.js';
import { isNotEmptyString } from '../../utils/helpers.js';
import type { Predicate } from '../types.js';
import { createAccountName } from '../utils/createAccountName.js';

interface ICreateAccountInput {
  accountName: string;
  publicKeys: string[];
  predicate: Predicate;
  chainId: ChainId;
  fungible: string;
}

export async function createAccountOnMainnet({
  accountName,
  publicKeys,
  predicate,
  chainId,
  fungible = 'coin',
}: ICreateAccountInput): Promise<CommandResult<string | undefined>> {
  try {
    const networkConfig = networkDefaults.mainnet;
    const account = isNotEmptyString(accountName)
      ? accountName
      : await createAccountName({
          publicKeys,
          chainId,
          predicate,
          networkConfig,
        });
    const keyPair = genKeyPair();

    await createAccount(
      {
        account: account,
        keyset: {
          pred: predicate,
          keys: publicKeys,
        },
        gasPayer: {
          account: 'kadena-xchain-gas',
          publicKeys: [keyPair.publicKey],
        },
        chainId: chainId,
        contract: fungible,
      },
      {
        host: networkConfig.networkHost,
        defaults: {
          networkId: networkConfig.networkId,
          meta: {
            chainId: chainId,
            gasLimit: 840,
          },
        },
        sign: createSignWithKeypair([keyPair]),
      },
    ).execute();

    return {
      status: 'success',
      data: account,
    };
  } catch (e) {
    if (e.message.includes('row found') === true) {
      const account = isNotEmptyString(accountName) ? `"${accountName}" ` : '';
      return {
        status: 'error',
        errors: [`Account ${account}already exists on chain "${chainId}"`],
      };
    }
    return {
      status: 'error',
      errors: [e.message],
    };
  }
}
