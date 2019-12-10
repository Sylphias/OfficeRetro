require("dotenv").config();

const Cron = require("./crons");
const bot = require("./bot");

Cron.DeclareCronJobs(bot);

bot.launch();
