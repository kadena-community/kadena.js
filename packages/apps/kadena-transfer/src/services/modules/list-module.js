import { PactCommand } from '@kadena/client';
import { createExp } from '@kadena/pactjs';

//List modules PACT code example

const NETWORK_ID = 'testnet04';
const chainId = '1';
const gasLimit = 6000;
const gasPrice = 0.001;
const ttl = 600;
export const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${chainId}/pact`;

export async function listModules() {
  // 1 - Create a new PactCommand
  const pactCommand = new PactCommand();

  // 2 - Bind to the Pact code
  pactCommand.code = createExp('list-modules');

  // 3 - Set the meta data
  pactCommand.setMeta({ gasLimit, gasPrice, ttl }, NETWORK_ID);

  // 4 - Call the Pact local endpoint to retrieve the result
  return await pactCommand.local(API_HOST);
}
