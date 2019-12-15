const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://aura-bot-staging.firebaseio.com',
});
const Firestore = admin.firestore();

module.exports = Firestore;
