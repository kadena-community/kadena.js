import type { EVMChainId } from '@/utils/evm';
import { createServerUrl } from '@/utils/evm';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { Request, Response } from 'http-proxy-middleware/dist/types';

export default function handler(req: Request, res: Response) {
  const [chainId] = req.query.slug as [EVMChainId];

  const proxyMiddleware = createProxyMiddleware({
    target: createServerUrl(chainId, true),
    secure: false,
    changeOrigin: true,
  });

  proxyMiddleware(req, res, (result: unknown) => {
    if (result instanceof Error) {
      throw result;
    }
  });
}

export const config = {
  api: {
    externalResolver: true,
    // Uncomment to fix stalled POST requests
    // https://github.com/chimurai/http-proxy-middleware/issues/795#issuecomment-1314464432
    bodyParser: false,
  },
};
