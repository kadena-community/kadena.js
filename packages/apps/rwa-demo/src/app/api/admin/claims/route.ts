import type { NextRequest } from 'next/server';
import { withAuth } from '../../withAuth';
import { adminAuth, getTokenId } from '../app';

const ALLOWEDROLES = ['rootAdmin', 'orgAdmin'];

const _POST = async (request: NextRequest) => {
  const { uid, role } = await request.json();

  const tokenId = getTokenId(request);
  const currentUser = await adminAuth()?.verifyIdToken(tokenId);

  //check if these roles are allowed

  const isRoleAllowed = ALLOWEDROLES.reduce((acc, val) => {
    if (role.hasOwnProperty(val)) return true;
    return acc;
  }, false);

  if (!isRoleAllowed) {
    return new Response('UnAuthorized', {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  //check if the current user has the rights to create this role
  if (!currentUser?.rootAdmin && role.hasOwnProperty('rootAdmin')) {
    return new Response('UnAuthorized', {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (
    !currentUser?.rootAdmin &&
    !currentUser?.orgAdmin &&
    role.hasOwnProperty('orgAdmin')
  ) {
    return new Response('UnAuthorized', {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!currentUser?.rootAdmin && role.hasOwnProperty('rootAdmin')) {
    return new Response('UnAuthorized', {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const user = await adminAuth()?.getUser(uid);
  const existingClaims = user?.customClaims || {};
  const updatedClaims = { ...existingClaims, ...role };

  await adminAuth()?.setCustomUserClaims(uid, updatedClaims);

  return new Response(JSON.stringify({ uid }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST = withAuth(_POST);
