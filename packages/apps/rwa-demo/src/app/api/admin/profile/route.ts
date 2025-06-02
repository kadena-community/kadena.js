import type { NextRequest } from 'next/server';
import { withOrgAdmin } from '../../withAuth';
import { adminAuth } from '../app';

const _POST = async (request: NextRequest) => {
  const { uid, displayName } = await request.json();

  await adminAuth()?.updateUser(uid, {
    displayName,
  });

  return new Response(JSON.stringify({ displayName }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST = withOrgAdmin(_POST);
