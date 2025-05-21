import type { NextRequest } from 'next/server';
import { withAuth } from '../../withAuth';
import { adminAuth } from '../app';

const _POST = async (request: NextRequest) => {
  const { uid } = await request.json();

  const user = await adminAuth()?.getUser(uid);
  const existingClaims = user?.customClaims || {};
  const updatedClaims = { ...existingClaims, rootAdmin: true };

  await adminAuth()?.setCustomUserClaims(uid, updatedClaims);

  return new Response(JSON.stringify({ uid }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST = withAuth(_POST);
