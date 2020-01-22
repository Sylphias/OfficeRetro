const Telegraf = require('telegraf');
// const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const firebaseSession = require('./telegraf-firestore-session');
const config = require('./config');
const { firestore } = require('./firebase');

const { leave } = Stage;

const bot = new Telegraf(config.botToken);

const stage = new Stage();

const CommonFeatures = require('./BotFeatures/Common');
const EmotionFeatures = require('./BotFeatures/Emotion');
const FeedbackFeatures = require('./BotFeatures/Feedback');

bot.use(firebaseSession(firestore.collection('sessions')));
bot.use(stage.middleware());
stage.command('cancel', leave());

CommonFeatures(bot);
FeedbackFeatures(bot, stage);
EmotionFeatures(bot, stage);
module.exports = bot;
