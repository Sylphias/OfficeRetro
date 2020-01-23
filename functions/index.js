const functions = require('firebase-functions');

const bot = require('./bot');
const groupCrons = require('./Crons/groups');

exports.mysecretbotendpoint = functions
  .region('asia-east2')
  .https.onRequest(async (req, res) => {
    if (req.method.toLowerCase() !== 'post' || req.url !== '/') {
      return res.status(403).send();
    }
    const update = req.body;
    if (update == null) {
      return res.status(415).send();
    }
    try {
      // Goes through all bot middlewares
      // Will send response if valid.
      await bot.handleUpdate(update, res);
      if (!res.headersSent) {
        // If not handled by bot, need to return success to telegram
        return res.send({ handled: true });
      }
      // Theoretically shouldn't happen.
      return res.status(500).send();
    } catch (err) {
      console.error(err.message);
      return res.status(500).send(err.message);
    }
  });

exports.scheduledUserActions = functions.pubsub
  .schedule('15 17 * * 1-5')
  .timeZone('Asia/Singapore')
  .onRun(async () => {
    await Promise.all([
      groupCrons.dailyGroupEmotionMessage(),
      groupCrons.groupRecordEmotion(),
    ]);
  });
