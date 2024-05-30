import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';

interface IHandlerOptions {
  network: string;
  chainId: string;
  endpoint: string;
  response: unknown;
  status: number;
  method?: 'post' | 'get';
  httpProtocol?: 'http' | 'https';
}

interface IDynamicHandlerOptions extends IHandlerOptions {
  getResponse: (req: Request) => Promise<unknown>;
}

const createHandler = ({
  network,
  chainId,
  response,
  status,
  endpoint = 'local',
  method = 'post',
  httpProtocol = 'https',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: IHandlerOptions): any => {
  const url = `${httpProtocol}://${network}.chainweb.com/chainweb/0.0/${network}/${chainId}/pact/api/v1/${endpoint}`;
  return http[method](url, async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return HttpResponse.json(response as any, { status });
  });
};

const createDynamicHandler = ({
  network,
  chainId,
  status,
  endpoint = 'local',
  method = 'post',
  httpProtocol = 'https',
  getResponse,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: IDynamicHandlerOptions): any => {
  const url = `${httpProtocol}://${network}.chainweb.com/chainweb/0.0/${network}/${chainId}/pact/api/v1/${endpoint}`;
  return http[method](url, async ({ request }) => {
    const response = await getResponse(request);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return HttpResponse.json(response as any, { status });
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
