import type { App, Router } from 'h3';
import { eventHandler, proxyRequest } from 'h3';
import { makeBlocks } from '../utils';
import type { PactToolboxNetworkApiLike } from './types';

export function setupRoutes(
  router: Router,
  networkApi: PactToolboxNetworkApiLike,
) {
  if (networkApi.isOnDemandMining()) {
    router.post(
      '/make-blocks',
      eventHandler((event) => {
        return proxyRequest(
          event,
          `${networkApi.getOnDemandUrl()}/make-blocks`,
        );
      }),
    );
  }
  router.post(
    '/pact-toolbox/restart',
    eventHandler(async () => {
      await networkApi.restart();
      return { status: 'ok' };
    }),
  );
}

export function setupWildCardProxy(
  app: App,
  networkApi: PactToolboxNetworkApiLike,
) {
  app.use(
    '*',
    eventHandler(async (event) => {
      const path = event.req.url;
      if (networkApi.isOnDemandMining() && path?.endsWith('/listen')) {
        await makeBlocks({
          count: 5,
          onDemandUrl: networkApi.getOnDemandUrl(),
        });
      }
      return proxyRequest(event, `${networkApi.getServiceUrl()}${path}`);
    }),
  );
}
