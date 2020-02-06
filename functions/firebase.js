const admin = require('firebase-admin');
const functions = require('firebase-functions');
const config = require('./config');

let firebaseOptions = {};
if (config.firebaseCredentials) {
  firebaseOptions.credential = admin.credential.cert(JSON.parse(config.firebaseCredentials));
} else {
  firebaseOptions = functions.config().firebase;
}

admin.initializeApp(firebaseOptions);
const Firestore = admin.firestore();

module.exports = {
  firestore: Firestore,
};
