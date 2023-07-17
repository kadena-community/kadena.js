import { getClient, Pact } from '@kadena/client';

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
  const { local } = getClient(apiHost());

  const transaction = Pact.builder
    .execution(Pact.modules.coin.details(account))
    .setMeta({ chainId: '1' })
    .createTransaction();

  const response = await local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  console.log(JSON.stringify(response, null, 2));
}

details(account).catch(console.error);
