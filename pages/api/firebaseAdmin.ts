import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: `${process.env.FIREBASE_PRIVATE_KEY}`.replace(/\\n/g, "\n"),
    }),
    databaseURL: `${process.env.PROJECT_ID}.firebaseio.com`,
    storageBucket: process.env.STORAGE_BUCKET,
  });

  admin.firestore().settings({
    ignoreUndefinedProperties: true,
  });
}
