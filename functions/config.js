require('dotenv').config();

module.exports = {
  botToken: process.env.BOT_TOKEN,
  botUrl: process.env.BOT_URL,
  firebaseCredentials: process.env.FIREBASE_CREDENTIALS ? process.env.FIREBASE_CREDENTIALS : require('./firebase-aura-tele.json'), // eslint-disable-line global-require
};
