const admin = require('firebase-admin');

let db = null;

const initializeFirebase = () => {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(
        require('./keys/serviceAccountKey.json')
      ),
    });
    db = admin.firestore();
    console.log('✅ Firebase initialized');
  }
  return db;
};

const getDb = () => {
  if (!db) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return db;
};

module.exports = { initializeFirebase, getDb };