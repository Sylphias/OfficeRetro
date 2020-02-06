const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const { CronJob } = require('cron');
const groupCrons = require('./Crons/groups');

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

CommonFeatures(bot);
FeedbackFeatures(bot, stage);
EmotionFeatures(bot, stage);
const mondayEmote = new CronJob('0 15 17 * * 1',
  () => { groupCrons.dailyGroupEmotionMessage(3); },
  null,
  true,
  'Asia/Singapore');

const dailyEmote = new CronJob('0 15 17 * * 2-5',
  () => { groupCrons.dailyGroupEmotionMessage(1); },
  null,
  true,
  'Asia/Singapore');

const dailyGroupEmoteReport = new CronJob('0 15 17 * * 1-5',
  groupCrons.groupRecordEmotion,
  null,
  true,
  'Asia/Singapore');
bot.launch();
// module.exports = bot;
