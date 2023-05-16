import { PactCommand } from '@kadena/client';
import { createExp } from '@kadena/pactjs';
import { type ChainId } from '@kadena/types';

const NETWORK_ID = 'testnet04';
const gasLimit = 6000;
const gasPrice = 0.001;
const ttl = 600;

// const token = 'coin';
// const acctName =
// 'k:2a41f51efddc35f479c8fc21985d7fc2e4766859d7a7629be48a3017d8b9602a';

// export const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${chainId}/pact`;

export async function checkBalance(
  server: string,
  token: string,
  accountName: string,
): Promise<any> {
  const arrPromises = [];

  // 1 - Create a new PactCommand
  const pactCommand = new PactCommand();

  // 2 - Bind to the Pact code
  pactCommand.code = createExp(`${token}.get-balance "${accountName}"`);

  try {
    for (let i = 0; i < 20; i++) {
      const host = `https://${server}/chainweb/0.0/${NETWORK_ID}/chain/${i}/pact`;
      // 3 - Set the meta data
      pactCommand.setMeta(
        {
          chainId: i.toString() as ChainId,
          gasLimit,
          gasPrice,
          ttl,
        },
        NETWORK_ID,
      );
      // 4 - Call the Pact local endpoint to retrieve the result
      const data = pactCommand.local(host, {
        signatureVerification: false,
        preflight: false,
      });
      console.log('result', data);
      console.log('host', host);
      arrPromises.push(data);
    }
    const responseArray = await Promise.all(arrPromises);
    console.log('responseArray', responseArray);

    const result = responseArray.map((item, index) => ({
      chain: index,
      data: item.result.data,
    }));
    return result;
  } catch (error) {
    console.log(error);
  }
}
