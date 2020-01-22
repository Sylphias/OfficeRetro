const admin = require('firebase-admin');
const functions = require('firebase-functions');
const config = require('./config');

let credentials;
let firebaseOptions = {};
if (config.useCredentialsFile) {
  credentials = require('../firebase-aura-tele.json'); // eslint-disable-line global-require
  firebaseOptions.credential = admin.credential.cert(credentials);
} else {
  firebaseOptions = functions.config().firebase;
}

admin.initializeApp(firebaseOptions);

module.exports = {
  firestore: admin.firestore(),
};
