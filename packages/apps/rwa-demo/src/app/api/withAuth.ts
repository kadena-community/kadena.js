import type { NextRequest } from 'next/server';
import { adminAuth, getTokenId } from './admin/app';

type Handler = (req: NextRequest, context?: any) => Promise<Response>;

export function withAuth(handler: Handler): Handler {
  return async (req, context) => {
    const tokenId = getTokenId(req);

    if (!tokenId) {
      return new Response('un authorized', {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const decodedToken = await adminAuth.verifyIdToken(tokenId);

    if (!decodedToken.uid) {
      console.log('error');
      return new Response('invalid token', {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If authenticated, call the original handler
    return handler(req, context);
  };
}
