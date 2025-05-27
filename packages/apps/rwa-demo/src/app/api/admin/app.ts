import type { App } from 'firebase-admin/app';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth as adminGetAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import type { NextRequest } from 'next/dist/server/web/spec-extension/request';

let app: App;

export const getTokenId = (request: NextRequest): string => {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return '';
  }

  return authHeader.split(' ')[1]; // safely extract the token
};

const getConfig = () => {
  return {
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FB_PROJECTID ?? '',
      clientEmail: process.env.FB_CLIENT_EMAIL ?? '',
      privateKey: (process.env.FB_PRIVATEKEY ?? '')?.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.NEXT_PUBLIC_FB_DBURL ?? '',
  };
};

const getApp = () => {
  if (!getApps().length) {
    app = initializeApp(getConfig());
  } else {
    app = getApps()[0];
  }
  return app;
};

export const adminAuth = () => {
  getApp();
  return adminGetAuth();
};

export const getDB = () => {
  getApp();
  return getDatabase();
};
