require("dotenv").config();

// const Cron = require("./crons");
const bot = require("./functions/bot");

// Cron.DeclareCronJobs(bot);

bot.launch();
