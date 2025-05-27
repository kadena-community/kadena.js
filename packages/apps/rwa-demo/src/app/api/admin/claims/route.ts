import type { UserRecord } from 'firebase-admin/auth';
import type { NextRequest } from 'next/server';
import { withAuth } from '../../withAuth';
import { adminAuth, getDB, getTokenId } from '../app';

const setClaims = async (user: UserRecord) => {
  const existingClaims = user?.customClaims || {};
  const updatedClaims = { ...existingClaims, rootAdmin: true };
  await adminAuth()?.setCustomUserClaims(user.uid, updatedClaims);

  await getDB().ref(`/roles/root/${user.uid}`).push(user.uid);
};

const _POST = async (request: NextRequest) => {
  const { email } = await request.json();

  const tokenId = getTokenId(request);
  const currentUser = await adminAuth()?.verifyIdToken(tokenId);
  //check if the current user has the rights to create this role
  if (!currentUser?.rootAdmin) {
    return new Response('UnAuthorized', {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const user = await adminAuth()?.getUserByEmail(email);
    await setClaims(user);
  } catch (e) {
    await adminAuth().createUser({
      email: email,
      emailVerified: false, // Optional
      password: 'superSecret123', // Required if you want password login
      displayName: 'Jane Doe', // Optional
      disabled: false, // Optional
    });

    const user = await adminAuth()?.getUserByEmail(email);
    await setClaims(user);
  }

  return new Response(JSON.stringify({ email }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST = withAuth(_POST);
