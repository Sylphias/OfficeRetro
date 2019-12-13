require('dotenv').config();

const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');

const { leave } = Stage;

const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Stage();

const Cron = require('./Crons/UserCrons.js');

const EmotionFeatures = require('./BotFeatures/Emotion');
const CommonFeatures = require('./BotFeatures/Common');
const FeedbackFeatures = require('./BotFeatures/Feedback');

bot.use(session());
bot.use(stage.middleware());
stage.command('cancel', leave());

CommonFeatures(bot, stage);
FeedbackFeatures(bot, stage);
EmotionFeatures(bot, stage);

Cron.DeclareCronJobs(bot);

bot.launch();
