import { HttpResponse, http } from 'msw';
import {
  accountDetailsSuccessData,
  createPrincipalSuccessData,
} from './data/accountDetails.js';

interface IPayloadData {
  cmd: string;
}

// Define handlers that catch the corresponding requests and returns the mock data.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlers: any = [
  http.post(
    'https://localhost:8080/chainweb/0.0/development/chain/1/pact/api/v1/local',
    () => {
      return HttpResponse.json(accountDetailsSuccessData, { status: 200 });
    },
  ),

  http.post(
    'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/local',
    async ({ request }): Promise<HttpResponse> => {
      const data = (await request.json()) as unknown as IPayloadData;
      if (data === undefined)
        return HttpResponse.json(accountDetailsSuccessData, { status: 200 });

      const parsedCMD = JSON.parse(data.cmd as string);

      if (parsedCMD.payload.exec.code.includes('coin.details') === true) {
        return HttpResponse.json(accountDetailsSuccessData, { status: 200 });
      }

      // transfer coin
      if (parsedCMD.payload.exec.code.includes('coin.transfer') === true) {
        return HttpResponse.json(
          {
            result: {
              data: 'Write succeeded',
              status: 'success',
            },
          },
          { status: 200 },
        );
      }

      // create principal
      if (parsedCMD.payload.exec.code.includes('create-principal') === true) {
        // create principal with only one key
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

      // default response
      return HttpResponse.json(
        {
          result: {
            data: 'Write succeeded',
            status: 'success',
          },
        },
        { status: 200 },
      );
    },
  ),

  http.post(
    'https://localhost:8080/chainweb/0.0/development/chain/1/pact/api/v1/send',
    () => {
      return HttpResponse.json(
        {
          requestKeys: ['requestKey-1', 'requestKey-2'],
        },
        { status: 200 },
      );
    },
  ),

  http.post(
    'https://localhost:8080/chainweb/0.0/development/chain/1/pact/api/v1/listen',
    () => {
      return HttpResponse.json(
        {
          result: {
            reqKey: 'requestKey-1',
            result: {
              data: 'Write succeeded',
              status: 'success',
            },
          },
        },
        { status: 200 },
      );
    },
  ),

  http.post(
    'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/send',
    () => {
      return HttpResponse.json(
        {
          requestKeys: ['requestKey-1', 'requestKey-2'],
        },
        { status: 200 },
      );
    },
  ),

  http.post(
    'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/listen',
    () => {
      return HttpResponse.json(
        {
          result: {
            reqKey: 'requestKey-1',
            result: {
              data: 'Write succeeded',
              status: 'success',
            },
          },
        },
        { status: 200 },
      );
    },
  ),

  // Mainnet
  http.post(
    'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact/api/v1/local',
    async ({ request }): Promise<HttpResponse> => {
      const data = (await request.json()) as unknown as IPayloadData;
      if (data === undefined)
        return HttpResponse.json(accountDetailsSuccessData, { status: 200 });

      const parsedCMD = JSON.parse(data.cmd as string);

      // create principal
      if (parsedCMD.payload.exec.code.includes('create-principal') === true) {
        // create principal with only one key
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

      // default response
      return HttpResponse.json(
        {
          result: {
            data: 'Write succeeded',
            status: 'success',
          },
        },
        { status: 200 },
      );
    },
  ),

  http.post(
    'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact/api/v1/send',
    () => {
      return HttpResponse.json(
        {
          requestKeys: ['requestKey-1'],
        },
        { status: 200 },
      );
    },
  ),

  http.post(
    'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact/api/v1/listen',
    () => {
      return HttpResponse.json(
        {
          result: {
            data: 'Write succeeded',
            status: 'success',
          },
        },
        { status: 200 },
      );
    },
  ),
];
