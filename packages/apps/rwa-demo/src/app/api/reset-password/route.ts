import { auth } from '@/utils/store/firebase';
import { confirmPasswordReset } from 'firebase/auth';
import type { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  const { oobCode, password } = await request.json();

  if (!oobCode) {
    return new Response('invalid Error', {
      status: 500,
      statusText: 'oobCode not found',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await confirmPasswordReset(auth, oobCode, password);
  } catch (e) {
    return new Response('invalid Error', {
      status: 500,
      statusText: 'Error confirming password reset',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response('Password was succesfully reset', {
    status: 200,
    statusText: 'Password was succesfully reset',
    headers: { 'Content-Type': 'application/json' },
  });
};
