import type { IUserData } from '@/contexts/UserContext/UserContext';
import type { IAddContractProps } from '@/services/createContract';
import { createContract } from '@/services/createContract';
import { objectsToArrayAccount } from '@/utils/objectsToArrayAccount';
import type { NextRequest } from 'next/server';
import { withOrgAdmin } from '../../withAuth';
import { adminAuth, getDB, getTokenId } from '../app';

const _POST = async (request: NextRequest) => {
  const { accountAddress, ...data } =
    (await request.json()) as IAddContractProps & { accountAddress: string };
  const organisationId = new URL(request.url).searchParams.get(
    'organisationId',
  );

  if (!data || !organisationId || !accountAddress) {
    return new Response('Not correct Data', {
      status: 401,
      statusText: 'Not correct Data',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const tokenId = getTokenId(request);
  const currentUser = await adminAuth()?.verifyIdToken(tokenId);
  if (!currentUser) {
    return new Response('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  //get user from firebase db
  const ref = await getDB().ref(
    `/organisations/${organisationId}/users/${currentUser.uid}`,
  );
  const snapshot = await ref.once('value');
  const userData = snapshot.toJSON() as IUserData;

  //find the correct account by account address from user
  const account = Object.entries(userData.accounts || {}).find(
    ([, account]) => account.address === accountAddress,
  )?.[1];

  if (!account) {
    return new Response('The account is not found on this user', {
      status: 500,
      statusText: 'The account is not found on this user',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const tx = await createContract(data, objectsToArrayAccount(account)!);

    return new Response(JSON.stringify({ tx }), {
      status: 200,
      statusText: 'Contract created successfully',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      statusText: e.message,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST = withOrgAdmin(_POST);
