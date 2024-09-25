import {
  addData,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import { readFileSync } from 'fs';
import { join } from 'path';
import { principalNamespaceCommand } from '../../built-in/create-principal-namespace';
import {
  fundExistingAccountOnTestnet,
  fundExistingAccountOnTestnetCommand,
  fundNewAccountOnTestnetCommand,
} from '../../faucet';
import {
  CHAIN_IDS,
  FAUCET_ADMINS,
  FAUCET_GUARD_PREDICATE,
  GAS_PAYER,
  PRIVATE_SIGNER,
} from './deploy-helpers/constants';
import { read, transaction } from './deploy-helpers/tx-helpers';

export async function deployFaucet() {
  const contractCode = readFileSync(
    join(__dirname, './testnet-faucet.pact'),
    'utf8',
  );
  CHAIN_IDS.forEach(async (chainId) => {
    // for (const chainId of CHAIN_IDS) {
    const tx = transaction(chainId);
    let upgrade = true;
    try {
      const namespace = 'n_f17eb6408bb84795b1c871efa678758882a8744a';
      const module = await read(chainId)(
        execution(`(describe-module "${namespace}.coin-faucet")`),
      );
      console.log('chain:', chainId, module);
      upgrade = true;
      // continue for now; remove this line to upgrade the contract
      return;
    } catch (e) {
      upgrade = false;
      console.log(e);
    }

    console.log(`creating namespace on chain ${chainId}`);
    const namespace = (await tx(
      principalNamespaceCommand(
        'admin-keyset',
        FAUCET_GUARD_PREDICATE,
        FAUCET_ADMINS,
        PRIVATE_SIGNER.PUBLIC_KEY,
      ),
    )) as string;

    // const namespace = 'n_f17eb6408bb84795b1c871efa678758882a8744a';

    // try {
    //   const namespace = 'coin-faucet';
    //   const module = await read(chainId)(
    //     execution(`(describe-module "${namespace}.coin-faucet")`),
    //   );
    //   console.log('module', module);
    //   upgrade = true;
    // } catch (e) {
    //   upgrade = false;
    //   console.log(e);
    // }
    // console.log(`Namespace: ${namespace}`);
    console.log(`deploying contract on chain ${chainId}`);
    const result = await tx(
      composePactCommand(
        execution(contractCode),
        addData('init', !upgrade),
        addData('coin-faucet-namespace', namespace),
        addData('coin-faucet-admin-keyset-name', `${namespace}.admin-keyset`),
        addSigner(PRIVATE_SIGNER.PUBLIC_KEY),
        setMeta({
          gasLimit: 100000,
        }),
      ),
    );
    console.log('transaction result', result);
  });
}

export async function requestNewFund() {
  CHAIN_IDS.forEach(async (chainId) => {
    const tx = transaction(chainId);
    const account = await read(chainId)(
      execution(
        'n_f17eb6408bb84795b1c871efa678758882a8744a.coin-faucet.FAUCET_ACCOUNT',
      ),
    );
    console.log('account', account);
    console.log(`transferring funds on chain ${chainId}`);
    console.log('testing contract');
    const test = await tx(
      fundNewAccountOnTestnetCommand({
        account: PRIVATE_SIGNER.PUBLIC_KEY,
        keyset: {
          keys: [PRIVATE_SIGNER.PUBLIC_KEY],
          pred: 'keys-all',
        },
        faucetAccount: account as string,
        amount: 10,
        chainId: chainId,
        contract: 'n_f17eb6408bb84795b1c871efa678758882a8744a.coin-faucet',
        signerKeys: [GAS_PAYER.PUBLIC_KEY],
        networkId: 'testnet05',
      }),
    );
    console.log('test result', test);
  });
}

export async function requestFund() {
  CHAIN_IDS.forEach(async (chainId) => {
    const tx = transaction(chainId);
    const account = await read(chainId)(
      execution(
        'n_f17eb6408bb84795b1c871efa678758882a8744a.coin-faucet.FAUCET_ACCOUNT',
      ),
    );
    console.log('account', account);
    console.log(`transferring funds on chain ${chainId}`);
    console.log('testing contract');
    const test = await tx(
      fundExistingAccountOnTestnetCommand({
        account: PRIVATE_SIGNER.PUBLIC_KEY,
        faucetAccount: account as string,
        amount: 10,
        chainId: chainId,
        contract: 'n_f17eb6408bb84795b1c871efa678758882a8744a.coin-faucet',
        signerKeys: [GAS_PAYER.PUBLIC_KEY],
        networkId: 'testnet05',
      }),
    );
    console.log('test result', test);
  });
}

export async function transferFunds() {
  CHAIN_IDS.forEach(async (chainId) => {
    const tx = transaction(chainId);
    const account = await read(chainId)(
      execution(
        'n_f17eb6408bb84795b1c871efa678758882a8744a.coin-faucet.FAUCET_ACCOUNT',
      ),
    );
    const balance = await read(chainId)(
      execution(`(coin.details "${account}")`),
    );
    console.log('balance', balance);
    console.log('account', account);
    console.log(`transferring funds on chain ${chainId}`);
    const result = await tx(
      composePactCommand(
        execution(
          `(coin.transfer "k:${PRIVATE_SIGNER.PUBLIC_KEY}" n_f17eb6408bb84795b1c871efa678758882a8744a.coin-faucet.FAUCET_ACCOUNT 1.0)`,
        ),
        addSigner(PRIVATE_SIGNER.PUBLIC_KEY, (signFor) => [
          signFor(
            'coin.TRANSFER',
            `k:${PRIVATE_SIGNER.PUBLIC_KEY}`,
            account,
            1,
          ),
        ]),
        setMeta({
          gasLimit: 2500,
        }),
      ),
    );
    console.log('transaction result', result);
  });
}

// transferFunds().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });

// requestFund().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });

deployFaucet().catch((err) => {
  console.error(err);
  process.exit(1);
});
