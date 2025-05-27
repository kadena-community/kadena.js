import type { UserRecord } from 'firebase-admin/auth';
import type { NextRequest } from 'next/server';
import { withRootAdmin } from '../../withAuth';
import { adminAuth, getDB, getTokenId } from '../app';

const setClaims = async (user: UserRecord) => {
  const existingClaims = user?.customClaims || {};
  const updatedClaims = { ...existingClaims, rootAdmin: true };
  await adminAuth()?.setCustomUserClaims(user.uid, updatedClaims);

  await getDB().ref(`/roles/root/${user.uid}`).push(user.uid);
};

const removeClaims = async (user: UserRecord) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { rootAdmin, ...existingClaims } = user?.customClaims || {};
  await adminAuth()?.setCustomUserClaims(user.uid, existingClaims);

  await getDB().ref(`/roles/root/${user.uid}`).remove();
};

const _POST = async (request: NextRequest) => {
  const { email } = await request.json();

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

const _DELETE = async (request: NextRequest) => {
  const uid = new URL(request.url).searchParams.get('uid');
  if (!uid) {
    return new Response('uid not set', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const tokenId = getTokenId(request);
  const currentUser = await adminAuth()?.verifyIdToken(tokenId);

  try {
    const user = await adminAuth()?.getUser(uid);

    if (currentUser.uid === user.uid) {
      return new Response('you can not delete your self as an admin', {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    await removeClaims(user);
  } catch (e) {}

  return new Response(JSON.stringify({ uid }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST = withRootAdmin(_POST);
export const DELETE = withRootAdmin(_DELETE);
