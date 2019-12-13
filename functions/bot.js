const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const config = require('./config');

const { leave } = Stage;

const bot = new Telegraf(config.botToken);

const stage = new Stage();

const CommonFeatures = require('./BotFeatures/Common');
const EmotionFeatures = require('./BotFeatures/Emotion');
const FeedbackFeatures = require('./BotFeatures/Feedback');

bot.use(session());
bot.use(stage.middleware());
stage.command('cancel', leave());

CommonFeatures(bot, stage);
FeedbackFeatures(bot, stage);
EmotionFeatures(bot, stage);

module.exports = bot;
