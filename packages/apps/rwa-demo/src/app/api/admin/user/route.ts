import type { NextRequest } from 'next/server';
import { withRootAdmin } from '../../withAuth';
import { adminAuth } from '../app';

const _POST = async (request: NextRequest) => {
  const { id } = await request.json();

  const user = await adminAuth()?.getUser(id);
  const existingClaims = user?.customClaims || {};

  if (!existingClaims.rootAdmin) {
    return new Response(`${id}: not a root admin`, {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
};

export const POST = withRootAdmin(_POST);
