import { auth } from '@/utils/store/firebase';
import { applyActionCode } from 'firebase/auth';
import type { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  const { oobCode } = await request.json();

  if (!oobCode) {
    return new Response('verification not valid', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await applyActionCode(auth, oobCode);
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
