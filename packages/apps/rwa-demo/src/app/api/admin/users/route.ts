import type { UserRecord } from 'firebase-admin/auth';
import type { NextRequest } from 'next/server';
import { withOrgAdmin } from '../../withAuth';
import { adminAuth, getDB } from '../app';

const _GET = async (request: NextRequest) => {
  const organisationId = new URL(request.url).searchParams.get(
    'organisationId',
  );

  if (!organisationId) {
    return new Response(`no id found`, {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // get the list of userIds from organisation
  const ref = await getDB().ref(`/organisationsUsers/${organisationId}`);
  const snapshot = await ref.once('value');
  const data = snapshot.toJSON() ?? {};

  const userIds = Object.entries(data).map(([key]) => ({
    uid: key,
  })) as { uid: string }[];

  // get the user info from firebase-admin

  try {
    const { users } = (await adminAuth().getUsers(userIds)) ?? [];

    console.log(
      `Fetched ${users.length} users for organisation ${organisationId}`,
    );
    //filter out the users that are not in the organisation
    const orgUsers = users.filter((user: UserRecord) => {
      const allowedOrgs = user.customClaims?.allowedOrgs || {};
      return allowedOrgs[organisationId];
    });

    return new Response(
      JSON.stringify(
        orgUsers.map((user) => ({
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          isOrgAdmin: !!user.customClaims?.orgAdmins?.[organisationId],
          rootAdmin: !!user.customClaims?.rootAdmin,
        })),
      ),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (e) {
    return new Response(`Error fetching users`, {
      status: 500,
      statusText: 'Error fetching users',
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const GET = withOrgAdmin(_GET);
