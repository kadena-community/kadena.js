import { getOriginKey } from '@/utils/getOriginKey';
import type { NextRequest } from 'next/server';
import { getDB } from './../admin/app';

export const GET = async (request: NextRequest) => {
  const origin = request.nextUrl.origin;

  if (!origin) {
    return new Response('origin not found', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const database = getDB();
  const orgRef = await database
    ?.ref('organisationsData')
    .orderByChild(`domains/${getOriginKey(origin)}/value`)
    .equalTo(origin);

  const snapshot = await orgRef.once('value');
  const data = snapshot.toJSON() ?? {};

  const organisationArray = Object.entries(data).map(([key, val]) => ({
    ...val,
    id: key,
  }));

  if (organisationArray.length !== 1) {
    return new Response('no correct domain found', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({ organisationId: organisationArray[0].id }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
};
