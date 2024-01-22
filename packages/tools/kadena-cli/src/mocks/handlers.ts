import { HttpResponse, http } from 'msw';
import {
  accountDetailsSuccessData,
  createPrincipalSuccessData,
} from './data/accountDetails.js';

// Define handlers that catch the corresponding requests and returns the mock data.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlers: any = [
  http.post(
    'https://localhost:8080/chainweb/0.0/fast-development/chain/1/pact/api/v1/local',
    () => {
      return HttpResponse.json(accountDetailsSuccessData, { status: 200 });
    },
  ),

  http.post(
    'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/local',
    async ({ request }) => {
      const data = await request.json();
      const parsedCMD = JSON.parse(data.cmd);
      if (parsedCMD.payload.exec.code.includes('create-principal')) {
        if (parsedCMD.payload.exec.data.ks.keys.length === 1) {
          return HttpResponse.json(
            {
              result: {
                data: `k:${parsedCMD.payload.exec.data.ks.keys}`,
                status: 'success',
              },
            },
            { status: 200 },
          );
        }

        return HttpResponse.json(createPrincipalSuccessData, { status: 200 });
      }

      return HttpResponse.json(accountDetailsSuccessData, { status: 200 });
    },
  ),
];
