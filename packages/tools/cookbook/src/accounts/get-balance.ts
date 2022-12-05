import { Pact } from '@kadena/client';

import { apiHost } from '../utils/api-host';

const HELP: string = `Usage example: \n\nts-node get-balance.js k:{accountPublicKey}`;

if (process.argv.length !== 3) {
  console.info(HELP);
  process.exit(1);
}

const [account] = process.argv.slice(2);

/**
 * Get KDA account balance
 *
 * @param account - Account name
 * @return
 */
async function getBalance(account: string): Promise<void> {
  const response = await Pact.modules.coin['get-balance'](account).local(
    apiHost(),
  );

  console.log(JSON.stringify(response, null, 2));
}

getBalance(account).catch(console.error);
