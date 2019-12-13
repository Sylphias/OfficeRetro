const functions = require("firebase-functions");
if (process.env.NODE_ENV === "production") {
  let config = functions.config();
  module.exports = {
    botToken: config.prod.bot.token,
    botUrl: config.prod.bot.url
  };
} else {
  module.exports = {
    botToken: process.env.BOT_TOKEN,
    botUrl: process.env.BOT_URL
  };
}