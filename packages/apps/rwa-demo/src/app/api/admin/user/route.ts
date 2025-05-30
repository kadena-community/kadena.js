import type { NextRequest } from 'next/server';
import { withOrgAdmin } from '../../withAuth';
import { adminAuth } from '../app';

const _GET = async (request: NextRequest) => {
  const id = new URL(request.url).searchParams.get('uid');
  const organisationId = new URL(request.url).searchParams.get(
    'organisationId',
  );

  if (!id) {
    return new Response(`no id found`, {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const user = await adminAuth()?.getUser(id);
  const existingClaims = user?.customClaims || {};

  if (!organisationId) {
    if (!existingClaims.rootAdmin) {
      return new Response(`${id}: not a root admin`, {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else {
    if (
      !existingClaims.orgAdmins ||
      !existingClaims.orgAdmins[organisationId]
    ) {
      return new Response(`${id}: not an admin for ${organisationId}`, {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
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

export const GET = withOrgAdmin(_GET);
