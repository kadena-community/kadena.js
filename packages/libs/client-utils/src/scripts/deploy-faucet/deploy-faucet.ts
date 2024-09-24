import { addData, composePactCommand, execution } from '@kadena/client/fp';
import { readFileSync } from 'fs';
import { join } from 'path';
import { principalNamespaceCommand } from '../../built-in/create-principal-namespace';
import {
  CHAIN_IDS,
  FAUCET_ADMINS,
  FAUCET_GUARD_PREDICATE,
} from './deploy-helpers/constants';
import { transaction } from './deploy-helpers/tx-helpers';

async function deployFaucet() {
  const contractCode = readFileSync(
    join(__dirname, './testnet-faucet.pact'),
    'utf8',
  );

  for (const chainId of CHAIN_IDS) {
    const tx = transaction(chainId);
    console.log(`creating namespace on chain ${chainId}`);
    const namespace = (await tx(
      principalNamespaceCommand(
        'admin-keyset',
        FAUCET_GUARD_PREDICATE,
        FAUCET_ADMINS.map((admin) => admin.publicKey),
      ),
    )) as string;
    console.log(`Namespace: ${namespace}`);
    console.log(`deploying contract on chain ${chainId}`);
    const result = await tx(
      composePactCommand(
        execution(contractCode),
        addData('coin-faucet-namespace', namespace),
        addData('coin-faucet-admin-keyset-name', `${namespace}.admin-keyset`),
      ),
    );
    console.log('transaction result', result);
  }
}

deployFaucet().catch((err) => {
  console.error(err);
  process.exit(1);
});
