import { Pact, createSignWithKeypair } from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import type { ChainId } from '@kadena/types';
import { describeModule } from '../built-in';
import { sourceAccount } from '../built-in/test/test-data';
import { transferCreate } from '../coin';
import { preflightClient, submitClient } from '../core';
import type { IClientConfig } from '../core/utils/helpers';
import {
  secondaryTargetAccount,
  sender00Account,
} from '../integration-tests/test-data/accounts';
import { deployMarmalade } from '../nodejs';

const chainId: ChainId = '0';

const whitelistSale = async (config: IClientConfig, saleContract: string) => {
  let saleWhitelisted = false;

  try {
    await preflightClient(config)(
      composePactCommand(
        execution(
          Pact.modules['marmalade-v2.policy-manager']['retrieve-sale'](
            saleContract,
          ),
        ),
        addSigner([sender00Account.publicKey], (signFor) => [
          signFor('coin.GAS'),
        ]),
        setMeta({ senderAccount: sender00Account.account, chainId }),
      ),
    ).execute();

    saleWhitelisted = true;
  } catch (error) {
    console.log(`Sale "${saleContract}" not whitelisted, whitelisting now`);
  }

  if (!saleWhitelisted) {
    try {
      await submitClient({
        host: 'http://127.0.0.1:8080',
        defaults: {
          networkId: 'development',
        },
        sign: createSignWithKeypair([sender00Account]),
      })(
        composePactCommand(
          execution(
            Pact.modules['marmalade-v2.policy-manager']['add-sale-whitelist'](
              () => saleContract,
            ),
          ),
          addSigner([sender00Account.publicKey], (signFor) => [
            signFor('coin.GAS'),
            signFor('marmalade-v2.policy-manager.SALE-WHITELIST', saleContract),
          ]),
          setMeta({ senderAccount: sender00Account.account, chainId }),
        ),
      ).execute();

      saleWhitelisted = true;
    } catch (error) {
      console.log(`Error whitelisting the sale contract "${saleContract}"`);
      throw error;
    }
  }
};

const main = async () => {
  console.log('Setting up marmalade test environment');

  const config: IClientConfig = {
    host: 'http://127.0.0.1:8080',
    defaults: {
      networkId: 'development',
      meta: {
        chainId,
      },
    },
    sign: createSignWithKeypair([sender00Account]),
  };
  let marmaladeDeployed = false;

  try {
    await describeModule('marmalade-v2.ledger', config);
    marmaladeDeployed = true;
  } catch (error) {
    console.log('Marmalade not deployed, deploying now');
  }

  if (!marmaladeDeployed) {
    await deployMarmalade({
      chainIds: [chainId],
      deleteFilesAfterDeployment: true,
    });
  }

  await whitelistSale(config, 'marmalade-sale.conventional-auction');
  await whitelistSale(config, 'marmalade-sale.dutch-auction');

  const [resultSourceAccount, resultTargetAccount] = await Promise.all([
    transferCreate(
      {
        sender: {
          account: sender00Account.account,
          publicKeys: [sender00Account.publicKey],
        },
        receiver: {
          account: sourceAccount.account,
          keyset: {
            keys: [sourceAccount.publicKey],
            pred: 'keys-all',
          },
        },
        amount: '100',
        chainId,
      },
      config,
    ).execute(),
    transferCreate(
      {
        sender: {
          account: sender00Account.account,
          publicKeys: [sender00Account.publicKey],
        },
        receiver: {
          account: secondaryTargetAccount.account,
          keyset: {
            keys: [secondaryTargetAccount.publicKey],
            pred: 'keys-all',
          },
        },
        amount: '100',
        chainId,
      },
      config,
    ).execute(),
  ]);

  if (
    resultSourceAccount !== 'Write succeeded' ||
    resultTargetAccount !== 'Write succeeded'
  ) {
    throw new Error('Toping up source and target accounts failed');
  }

  console.log('Marmalade test environment setup complete');
};

main().catch(console.error);
