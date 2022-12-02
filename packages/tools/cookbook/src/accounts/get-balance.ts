import { Pact } from '@kadena/client';
import { apiHost } from '../utils';

const HELP = `Usage example: \n\nts-node create-account.js k:{accountPublicKey}`;

if (process.argv.length !== 3) {
  console.info(HELP);
  process.exit(1);
}

const [account] = process.argv.slice(2);

async function transferCreate(account: string): Promise<void> {
  const response = await Pact.modules.coin['get-balance'](account).local(
    apiHost(),
  );

  console.log(response);
}

transferCreate(account).catch(console.error);
