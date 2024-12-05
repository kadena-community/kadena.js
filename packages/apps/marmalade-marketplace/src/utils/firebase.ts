import { FirebaseOptions, initializeApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

let database: Firestore;
if (
  process.env.NEXT_PUBLIC_FB_APIKEY &&
  process.env.NEXT_PUBLIC_FB_PROJECTID &&
  process.env.NEXT_PUBLIC_FB_APPID
) {
  const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FB_APIKEY,
    projectId: process.env.NEXT_PUBLIC_FB_PROJECTID,
    appId: process.env.NEXT_PUBLIC_FB_APPID,
  };

  const app = initializeApp(firebaseConfig);
  database = getFirestore(app);
}

export { database };
