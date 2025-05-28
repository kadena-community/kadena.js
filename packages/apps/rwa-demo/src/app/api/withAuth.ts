import type { NextRequest } from 'next/server';
import { adminAuth, getTokenId } from './admin/app';

type Handler = (req: NextRequest, context?: any) => Promise<Response>;

export function withAuth(handler: Handler): Handler {
  return async (req, context) => {
    const tokenId = getTokenId(req);

    if (!tokenId || !adminAuth()) {
      return new Response('un authorized', {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const decodedToken = await adminAuth()?.verifyIdToken(tokenId);

    if (!decodedToken?.uid) {
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

export function withRootAdmin(handler: Handler): Handler {
  return async (req, context) => {
    const tokenId = getTokenId(req);

    const currentUser = await adminAuth()?.verifyIdToken(tokenId);
    //check if the current user has the rights to create this role
    if (!currentUser?.rootAdmin) {
      return new Response('UnAuthorized', {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If authenticated, call the original handler
    return handler(req, context);
  };
}

export function withOrgAdmin(handler: Handler): Handler {
  return async (req, context) => {
    const tokenId = getTokenId(req);
    const organisationId = new URL(req.url).searchParams.get('organisationId');
    if (!organisationId) {
      return new Response('UnAuthorized', {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const currentUser = await adminAuth()?.verifyIdToken(tokenId);
    console.log({ organisationId, currentUser, url: req.url });
    //check if the current user has the rights to create this role
    if (!currentUser?.rootAdmin && !currentUser?.orgAdmins[organisationId]) {
      return new Response('UnAuthorized', {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If authenticated, call the original handler
    return handler(req, context);
  };
}
