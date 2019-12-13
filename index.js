require('dotenv').config();
const Cron = require('./Crons/UserCrons.js');
const bot = require('./functions/bot');

Cron.DeclareCronJobs(bot);

bot.launch();
