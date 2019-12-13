const functions = require("firebase-functions");
const bot = require("./bot");

exports.mysecretbotendpoint = functions
  .region("asia-east2")
  .https.onRequest(async (req, res) => {
    if (req.method.toLowerCase() !== "post" || req.url !== "/") {
      return res.status(403).send();
    }
    let update = req.body;
    if (update == null) {
      return res.status(415).send();
    }
    try {
      await bot.handleUpdate(update, res);
      if (!res.headersSent) {
        // If not handled by bot, need to return success to telegram
        return res.send({ handled: true });
      }
    } catch (err) {
      console.error(err.message);
      return res.status(500).send(err.message);
    }
  });
