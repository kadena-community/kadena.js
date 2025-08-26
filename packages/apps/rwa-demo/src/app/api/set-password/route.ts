import type { NextRequest } from 'next/server';
import { adminAuth } from '../admin/app';

export const POST = async (request: NextRequest) => {
  const { password, email } = await request.json();

  if (!password || !email) {
    return new Response('no password set', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const user = await adminAuth().getUserByEmail(email);
    if (!user) {
      return new Response('User not found', {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await adminAuth().updateUser(user.uid, { password });
  } catch (error) {
    console.error('Error getting auth instance:', error);
    return new Response('Internal Server Error', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify('successfully verified'), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
