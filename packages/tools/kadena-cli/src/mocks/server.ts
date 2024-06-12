import type { RequestHandler } from 'msw';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import type { INetworkCreateOptions } from '../commands/networks/utils/networkHelpers.js';
import { testNetworkConfigMock } from './network.js';

interface IHandlerOptions {
  network?: INetworkCreateOptions;
  endpoint?: string;
  chainId?: string;
  response: unknown;
  status?: number;
  method?: 'post' | 'get';
}

interface IDynamicHandlerOptions extends Omit<IHandlerOptions, 'response'> {
  getResponse: (req: Request) => Promise<unknown>;
}

const createHandler = ({
  network = testNetworkConfigMock,
  endpoint = 'local',
  chainId = '1',
  status = 200,
  method = 'post',
  response,
}: IHandlerOptions): RequestHandler => {
  const url = `${network.networkHost}/chainweb/0.0/${network.networkId}/chain/${chainId}/pact/api/v1/${endpoint}`;
  return http[method](url, async () => {
    if (
      typeof response === 'string' ||
      response === undefined ||
      response === null
    ) {
      return new HttpResponse(response, { status });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return HttpResponse.json(response as any, { status });
  });
};

const createDynamicHandler = ({
  network = testNetworkConfigMock,
  chainId = '1',
  endpoint = 'local',
  method = 'post',
  getResponse,
}: IDynamicHandlerOptions): RequestHandler => {
  const url = `${network.networkHost}/chainweb/0.0/${network.networkId}/chain/${chainId}/pact/api/v1/${endpoint}`;
  return http[method](url, async ({ request }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = (await getResponse(request)) as any[];
    return HttpResponse.json(...response);
  });
};

const server = setupServer();

const useMswHandler = (options: IHandlerOptions): void => {
  const handler = createHandler(options);
  server.use(handler);
};

const useMswDynamicHandler = (options: IDynamicHandlerOptions): void => {
  const handler = createDynamicHandler(options);
  server.use(handler);
};

export {
  createDynamicHandler,
  createHandler,
  server,
  useMswDynamicHandler,
  useMswHandler,
};
