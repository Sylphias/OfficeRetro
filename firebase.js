const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://aura-tele-bot.firebaseio.com"
});
const Firestore = admin.firestore();

module.exports = Firestore
