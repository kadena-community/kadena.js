import { sendResetMail } from '@/utils/sendResetMail';
import type { NextRequest } from 'next/server';
import { adminAuth } from '../admin/app';

export const POST = async (request: NextRequest) => {
  const { email, organisationId } = await request.json();

  if (!email || !organisationId) {
    return new Response('invalid Error', {
      status: 500,
      statusText: 'invalid Error',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const user = await adminAuth().getUserByEmail(email);
  if (!user) {
    return new Response('invalid Error', {
      status: 500,
      statusText: 'invalid Error',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const emailLink = await adminAuth().generatePasswordResetLink(email);

  await sendResetMail({
    user,
    emailVerificationLink: emailLink,
    organisationId,
  });

  return new Response('Reset email sent', {
    status: 200,
    statusText: 'Reset email sent',
    headers: { 'Content-Type': 'application/json' },
  });
};
