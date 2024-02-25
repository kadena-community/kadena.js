// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import type { Database, DatabaseReference } from 'firebase/database';
import { getDatabase, ref } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

let database: Database;
let dbRef: DatabaseReference;
if (
  process.env.NEXT_PUBLIC_FB_APIKEY &&
  process.env.NEXT_PUBLIC_FB_DBURL &&
  process.env.NEXT_PUBLIC_FB_PROJECTID &&
  process.env.NEXT_PUBLIC_FB_APPID &&
  process.env.NEXT_PUBLIC_FB_MEASURMENTID
) {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FB_APIKEY,
    databaseURL: process.env.NEXT_PUBLIC_FB_DBURL,
    projectId: process.env.NEXT_PUBLIC_FB_PROJECTID,
    appId: process.env.NEXT_PUBLIC_FB_APPID,
    measurementId: process.env.NEXT_PUBLIC_FB_MEASURMENTID,
  };

  const app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  dbRef = ref(getDatabase());
}

// Initialize Firebase

export { database, dbRef };

//export const analytics = getAnalytics(app);
