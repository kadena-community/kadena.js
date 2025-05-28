import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import { randomUUID } from 'crypto';
import type { UserRecord } from 'firebase-admin/auth';
import { NextResponse, type NextRequest } from 'next/server';
import { withOrgAdmin } from '../../withAuth';
import { adminAuth, getDB, getTokenId } from '../app';

const setClaims = async (
  user: UserRecord,
  organisationId?: IOrganisation['id'] | null,
) => {
  const existingClaims = user?.customClaims || {};

  if (!organisationId) {
    const updatedClaims = { ...existingClaims, rootAdmin: true };
    await adminAuth()?.setCustomUserClaims(user.uid, updatedClaims);
    await getDB().ref(`/roles/root/${user.uid}`).set({ id: user.uid });
  } else {
    //add the organisationId to the array
    const orgAdmins = existingClaims.orgAdmins;

    const updatedClaims = {
      ...existingClaims,
      orgAdmins: { ...orgAdmins, [organisationId]: true },
    };
    await adminAuth()?.setCustomUserClaims(user.uid, updatedClaims);
    await getDB()
      .ref(`/roles/${organisationId}/${user.uid}`)
      .set({ id: user.uid });
  }
};

const removeClaims = async (
  user: UserRecord,
  organisationId?: IOrganisation['id'] | null,
) => {
  if (!organisationId) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rootAdmin, ...updatedClaims } = user?.customClaims || {};
    await adminAuth()?.setCustomUserClaims(user.uid, updatedClaims);
    await getDB().ref(`/roles/root/${user.uid}`).remove();
  } else {
    const existingClaims = user?.customClaims || {};

    //add the organisationId to the array
    const orgAdmins = { ...existingClaims.orgAdmins };
    delete orgAdmins[organisationId];
    const updatedClaims = {
      ...existingClaims,
      orgAdmins,
    };

    await adminAuth()?.setCustomUserClaims(user.uid, updatedClaims);
    await getDB().ref(`/roles/${organisationId}/${user.uid}`).remove();
  }
};

const _POST = async (request: NextRequest) => {
  const { email, organisationId } = await request.json();

  try {
    const user = await adminAuth()?.getUserByEmail(email);
    await setClaims(user, organisationId);
  } catch (e) {
    await adminAuth().createUser({
      email: email,
      emailVerified: false, // Optional
      password: randomUUID(),
      displayName: '-', // Optional
      disabled: false, // Optional
    });

    const user = await adminAuth()?.getUserByEmail(email);
    await setClaims(user, organisationId);
  }

  return new Response(JSON.stringify({ email }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

const _DELETE = async (request: NextRequest) => {
  const uid = new URL(request.url).searchParams.get('uid');
  const organisationId = new URL(request.url).searchParams.get(
    'organisationId',
  );

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
      return NextResponse.json(
        { message: 'you can not delete your self as an admin' },
        { status: 400 },
      );
    }
    await removeClaims(user, organisationId);
  } catch (e) {}

  return new Response(JSON.stringify({ uid }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST = withOrgAdmin(_POST);
export const DELETE = withOrgAdmin(_DELETE);
