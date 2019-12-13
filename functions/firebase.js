const admin = require('firebase-admin');

admin.initializeApp();
const Firestore = admin.firestore();

module.exports = {
  firestore: Firestore,
};
