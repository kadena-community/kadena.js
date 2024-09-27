import {
  addData,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import { PactNumber } from '@kadena/pactjs';
import { readFileSync } from 'fs';
import { join } from 'path';
import { principalNamespaceCommand } from '../../built-in/create-principal-namespace';
import {
  fundExistingAccountOnTestnetCommand,
  fundNewAccountOnTestnetCommand,
} from '../../faucet';
import {
  CHAIN_IDS,
  FAUCET_ADMINS,
  FAUCET_GUARD_PREDICATE,
  GAS_PAYER,
  INCOMING_AMOUNT,
  PRIVATE_SIGNER,
  TASK,
  TO_FUND_PUBLIC_KEY,
  UPGRADE,
} from './deploy-helpers/constants';
import { kadenaContext } from './deploy-helpers/tx-helpers';

const kadenaChains = kadenaContext(CHAIN_IDS);

async function deployFaucet() {
  const contractCode = readFileSync(
    join(__dirname, './testnet-faucet.pact'),
    'utf8',
  );
  await kadenaChains(async ({ transaction, read, chainId }) => {
    let upgrade = true;
    try {
      // the namespace based on the keyset; if the keyset changes, set the correct one
      const namespace = 'n_f17eb6408bb84795b1c871efa678758882a8744a';
      const module = await read(`(describe-module "${namespace}.coin-faucet")`);
      console.log('chain:', chainId, module);
      upgrade = true;
      if (!UPGRADE) {
        return;
      }
    } catch (e) {
      upgrade = false;
      console.log(e);
    }

    console.log(`creating namespace on chain ${chainId}`);
    const namespace = (await transaction(
      principalNamespaceCommand({
        keysetName: 'admin-keyset',
        pred: FAUCET_GUARD_PREDICATE,
        keys: FAUCET_ADMINS,
        signer: PRIVATE_SIGNER.PUBLIC_KEY,
      }),
    )) as string;
    console.log('namespace', namespace);
    console.log(`deploying contract on chain ${chainId}`);
    const result = await transaction(
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
    console.log('transaction result', chainId, result);
  });
}

async function requestNewFund() {
  const kadena = kadenaContext(CHAIN_IDS);
  await kadena(async ({ transaction, read, chainId }) => {
    const account = await read(
      'n_f17eb6408bb84795b1c871efa678758882a8744a.coin-faucet.FAUCET_ACCOUNT',
    );
    console.log('account', account);
    console.log(`transferring funds on chain ${chainId}`);
    console.log('testing contract');
    const test = await transaction(
      fundNewAccountOnTestnetCommand({
        account: `k:${TO_FUND_PUBLIC_KEY}`,
        keyset: {
          keys: [TO_FUND_PUBLIC_KEY],
          pred: 'keys-all',
        },
        faucetAccount: account as string,
        amount: 10,
        chainId: chainId,
        contract: 'n_f17eb6408bb84795b1c871efa678758882a8744a.coin-faucet',
        signerKeys: [GAS_PAYER.PUBLIC_KEY],
        networkId: 'testnet05',
      }),
      { noDefaultSender: true },
    );
    console.log('fund result:', chainId, test);
  });
}

async function requestFund() {
  await kadenaChains(async ({ transaction, read, chainId }) => {
    const account = (await read(
      'n_f17eb6408bb84795b1c871efa678758882a8744a.coin-faucet.FAUCET_ACCOUNT',
    )) as string;
    console.log('account', account);
    console.log(`transferring funds on chain ${chainId}`);
    console.log('testing contract');
    const test = await transaction(
      fundExistingAccountOnTestnetCommand({
        account: `k:${TO_FUND_PUBLIC_KEY}`,
        faucetAccount: account as string,
        amount: 10,
        chainId: chainId,
        contract: 'n_f17eb6408bb84795b1c871efa678758882a8744a.coin-faucet',
        signerKeys: [GAS_PAYER.PUBLIC_KEY],
        networkId: 'testnet05',
      }),
      { noDefaultSender: true },
    );
    console.log('fund result:', chainId, test);
  });
}

async function transferFunds() {
  await kadenaChains(async ({ transaction, read, chainId }) => {
    const account = await read(
      'n_f17eb6408bb84795b1c871efa678758882a8744a.coin-faucet.FAUCET_ACCOUNT',
    );
    const balance = new PactNumber(
      (await read(`(coin.get-balance "${account}")`)) as string,
    ).toDecimal();

    console.log(
      'account',
      await read(`(coin.get-balance "k:${PRIVATE_SIGNER.PUBLIC_KEY}")`),
    );

    const sourceBalance = new PactNumber(
      (await read(
        `(coin.get-balance "k:${PRIVATE_SIGNER.PUBLIC_KEY}")`,
      )) as string,
    ).toDecimal();
    console.log({ balance, sourceBalance, INCOMING_AMOUNT });
    const transferAmount = new PactNumber(INCOMING_AMOUNT).toDecimal();
    if (new PactNumber(sourceBalance as string).lt(INCOMING_AMOUNT)) {
      console.error(
        `the account balance (${sourceBalance}) is less than requested amount (${INCOMING_AMOUNT})`,
      );
      return;
    }
    console.log('balance', balance);
    console.log('account', account);
    console.log(`transferring funds on chain ${chainId}`);
    const result = await transaction(
      composePactCommand(
        execution(
          `(coin.transfer "k:${PRIVATE_SIGNER.PUBLIC_KEY}" n_f17eb6408bb84795b1c871efa678758882a8744a.coin-faucet.FAUCET_ACCOUNT ${transferAmount})`,
        ),
        addSigner(PRIVATE_SIGNER.PUBLIC_KEY, (signFor) => [
          signFor('coin.TRANSFER', `k:${PRIVATE_SIGNER.PUBLIC_KEY}`, account, {
            decimal: transferAmount,
          }),
        ]),
        addSigner(GAS_PAYER.PUBLIC_KEY, (signFor) => [signFor('coin.GAS')]),
        setMeta({
          senderAccount: GAS_PAYER.ACCOUNT,
          gasLimit: 2500,
        }),
      ),
    );
    console.log('transaction result', result);
  });
}

async function getBalance() {
  await kadenaChains(async ({ read, chainId }) => {
    const balance = await read(
      `(coin.get-balance n_f17eb6408bb84795b1c871efa678758882a8744a.coin-faucet.FAUCET_ACCOUNT )`,
    );
    console.log(
      'chain',
      chainId,
      new PactNumber(balance as string).toDecimal(),
    );
  });
}

async function getAccountDetails() {
  await kadenaChains(async ({ read, chainId }) => {
    const balance = await read(
      `(coin.details n_f17eb6408bb84795b1c871efa678758882a8744a.coin-faucet.FAUCET_ACCOUNT )`,
    );
    console.log('chain', chainId, balance);
  });
}

if (TASK === 'transfer') {
  transferFunds().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

if (TASK === 'fund') {
  requestFund().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

if (TASK === 'fund-create') {
  requestNewFund().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

if (TASK === 'deploy') {
  deployFaucet().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

if (TASK === 'balance') {
  getBalance().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

if (TASK === 'account-details') {
  getAccountDetails().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
