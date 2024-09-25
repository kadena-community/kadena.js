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
  CHAIN_IDS,
  FAUCET_ADMINS,
  FAUCET_GUARD_PREDICATE,
  PRIVATE_SIGNER,
} from './deploy-helpers/constants';
import { read, transaction } from './deploy-helpers/tx-helpers';

async function deployFaucet() {
  const contractCode = readFileSync(
    join(__dirname, './testnet-faucet.pact'),
    'utf8',
  );

  for (const chainId of CHAIN_IDS) {
    const tx = transaction(chainId);
    let upgrade;
    try {
      const namespace = 'n_f17eb6408bb84795b1c871efa678758882a8744a';
      const module = await read(chainId)(
        execution(`(describe-module "${namespace}.coin-faucet")`),
      );
      console.log('chain:', chainId, module);
      upgrade = true;
      // continue for now; remove this line to upgrade the contract
      // continue;
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

    try {
      const namespace = 'coin-faucet';
      const module = await read(chainId)(
        execution(`(describe-module "${namespace}.coin-faucet")`),
      );
      console.log('module', module);
      upgrade = true;
    } catch (e) {
      upgrade = false;
      console.log(e);
    }
    console.log(`Namespace: ${namespace}`);
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
  }
}

deployFaucet().catch((err) => {
  console.error(err);
  process.exit(1);
});
