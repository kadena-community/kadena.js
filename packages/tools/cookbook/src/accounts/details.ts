import { Pact } from '@kadena/client';

import { apiHost } from '../utils/api-host';

const HELP: string = `Usage example: \n\nts-node details.js k:{accountPublicKey}`;

if (process.argv.length !== 3) {
  console.info(HELP);
  process.exit(1);
}

const [account] = process.argv.slice(2);

/**
 * View details for an account
 *
 * @param account - Account name
 * @return
 */
async function details(account: string): Promise<void> {
  const response = await Pact.modules.coin.details(account).local(apiHost());

  console.log(JSON.stringify(response, null, 2));
}

details(account).catch(console.error);
