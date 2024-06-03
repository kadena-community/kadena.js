import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';

interface IHandlerOptions {
  networkUrl?: string;
  networkId?: string;
  chainId?: string;
  endpoint?: string;
  response: unknown;
  status?: number;
  method?: 'post' | 'get';
}

interface IDynamicHandlerOptions extends Omit<IHandlerOptions, 'response'> {
  getResponse: (req: Request) => Promise<unknown>;
}

const createHandler = ({
  networkUrl = 'https://api.testnet.chainweb.com',
  chainId = '1',
  status = 200,
  endpoint = 'local',
  method = 'post',
  networkId = 'testnet04',
  response,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: IHandlerOptions): any => {
  const url = `${networkUrl}/chainweb/0.0/${networkId}/chain/${chainId}/pact/api/v1/${endpoint}`;
  return http[method](url, async () => {
    if (typeof response === 'string') {
      return new HttpResponse(response, { status });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return HttpResponse.json(response as any, { status });
  });
};

const createDynamicHandler = ({
  networkUrl = 'https://api.testnet.chainweb.com',
  chainId = '1',
  endpoint = 'local',
  method = 'post',
  networkId = 'testnet04',
  getResponse,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: IDynamicHandlerOptions): any => {
  const url = `${networkUrl}/chainweb/0.0/${networkId}/chain/${chainId}/pact/api/v1/${endpoint}`;
  return http[method](url, async ({ request }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = (await getResponse(request)) as any[];
    return HttpResponse.json(...response);
  });
};

const server = setupServer();

const useHandler = (options: IHandlerOptions): void => {
  const handler = createHandler(options);
  server.use(handler);
};

const useDynamicHandler = (options: IDynamicHandlerOptions): void => {
  const handler = createDynamicHandler(options);
  server.use(handler);
};

export {
  createDynamicHandler,
  createHandler,
  server,
  useDynamicHandler,
  useHandler,
};
