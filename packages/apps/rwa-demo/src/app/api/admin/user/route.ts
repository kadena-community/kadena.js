import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import { sendVerificationMail } from '@/utils/sendVerificationMail';
import { randomUUID } from 'crypto';
import type { UserRecord } from 'firebase-admin/auth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { withOrgAdmin } from '../../withAuth';
import { adminAuth, getDB, getTokenId } from '../app';

const setOrgClaim = async (
  user: UserRecord,
  organisationId?: IOrganisation['id'] | null,
) => {
  if (!organisationId) return;

  const existingClaims = user?.customClaims || {};
  //add the organisationId to the array
  const allowedOrgs = existingClaims.allowedOrgs;

  const updatedClaims = {
    ...existingClaims,
    allowedOrgs: { ...allowedOrgs, [organisationId]: true },
  };
  await adminAuth()?.setCustomUserClaims(user.uid, updatedClaims);
  await getDB()
    .ref(`/organisationsUsers/${organisationId}/${user.uid}`)
    .set({ uid: user.uid });
};

const removeOrgClaim = async (
  user: UserRecord,
  organisationId?: IOrganisation['id'] | null,
) => {
  if (!organisationId) return;
  const existingClaims = user?.customClaims || {};

  //remove the organisationId
  const allowedOrgs = { ...existingClaims.allowedOrgs };
  delete allowedOrgs[organisationId];
  const updatedClaims = {
    ...existingClaims,
    allowedOrgs,
  };

  await adminAuth()?.setCustomUserClaims(user.uid, updatedClaims);
  await getDB()
    .ref(`/organisationsUsers/${organisationId}/${user.uid}`)
    .remove();
};

const _GET = async (request: NextRequest) => {
  const id = new URL(request.url).searchParams.get('uid');

  if (!id) {
    return new Response(`no id found`, {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const user = await adminAuth()?.getUser(id);

  return new Response(
    JSON.stringify({
      uid: user.uid,
      email: user.email,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
};

const _POST = async (request: NextRequest) => {
  const { email, organisationId } = await request.json();

  let user: UserRecord | null = null;
  try {
    user = await adminAuth()?.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    await setOrgClaim(user, organisationId);
  } catch (e) {
    await adminAuth().createUser({
      email: email,
      emailVerified: false, // Optional
      password: randomUUID(),
      displayName: '-', // Optional
    });

    user = await adminAuth()?.getUserByEmail(email);
    await setOrgClaim(user, organisationId);
  }

  if (!user || !user.email) {
    return new Response('creation of email failed', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const emailLink = await adminAuth().generateEmailVerificationLink(user.email);

  await sendVerificationMail({
    user,
    emailVerificationLink: emailLink,
    organisationId,
  });

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
    await removeOrgClaim(user, organisationId);

    //remove user data from DB

    try {
      await getDB()
        .ref(`/organisationsUsers/${organisationId}/${user.uid}`)
        .remove();
    } catch (e) {
      console.log(e);
    }

    try {
      await getDB()
        .ref(`/organisations/${organisationId}/users/${user.uid}`)
        .remove();
    } catch (e) {
      console.log(e);
    }

    try {
      await getDB()
        .ref(`/organisationRoles/${organisationId}/${user.uid}`)
        .remove();
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }

  return new Response(JSON.stringify({ uid }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const GET = withOrgAdmin(_GET);
export const POST = withOrgAdmin(_POST);
export const DELETE = withOrgAdmin(_DELETE);
