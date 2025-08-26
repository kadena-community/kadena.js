import { auth } from '@/utils/store/firebase';
import { applyActionCode } from 'firebase/auth';
import type { NextRequest } from 'next/server';
import { adminAuth } from '../admin/app';

export const POST = async (request: NextRequest) => {
  const { oobCode, email } = await request.json();

  if (!oobCode) {
    return new Response('verification not valid', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const user = await adminAuth().getUserByEmail(email);
    if (user.emailVerified) {
      return new Response('email already verified', {
        status: 200,
        statusText: 'Email already verified',
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await applyActionCode(auth, oobCode);
  } catch (error) {
    console.error('Error getting auth instance:', error);
    return new Response('Internal Server Error', {
      status: 500,
      statusText: 'Internal Server Error',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify('successfully verified'), {
    status: 200,
    statusText: 'Successfully verified',
    headers: { 'Content-Type': 'application/json' },
  });
};
