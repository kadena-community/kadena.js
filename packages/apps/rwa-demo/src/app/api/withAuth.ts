import type { NextRequest } from 'next/server';
import { adminAuth, getTokenId } from './admin/app';

type Handler = (req: NextRequest, context?: any) => Promise<Response>;

//makes sure that the user is authenticated
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

//makes sure that the user is authenticated and has the root admin role
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

//makes sure that the user is authenticated and has the org admin role
//for the organisationId passed in the query params or the current user is a root admin
export function withOrgAdmin(handler: Handler): Handler {
  return async (req, context) => {
    const tokenId = getTokenId(req);
    const organisationId = new URL(req.url).searchParams.get('organisationId');

    const currentUser = await adminAuth()?.verifyIdToken(tokenId);
    //check if the current user has the rights to create this role

    if (
      !currentUser?.rootAdmin &&
      (!organisationId || !(currentUser?.orgAdmins ?? {})[organisationId])
    ) {
      console.log('UnAuthorized');
      return new Response('UnAuthorized', {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If authenticated, call the original handler
    return handler(req, context);
  };
}
