import type { App } from 'firebase-admin/app';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth as adminGetAuth } from 'firebase-admin/auth';
import type { NextRequest } from 'next/dist/server/web/spec-extension/request';

let app: App;

export const getTokenId = (request: NextRequest): string => {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return '';
  }

  return authHeader.split(' ')[1]; // safely extract the token
};

if (!getApps().length) {
  app = app = initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FB_PROJECTID ?? '',
      clientEmail: process.env.FB_CLIENT_EMAIL ?? '',
      privateKey: (process.env.FB_PRIVATEKEY ?? '')?.replace(/\\n/g, '\n'),
    }),
  });
} else {
  app = getApps()[0];
}

export const adminAuth = adminGetAuth(app);
