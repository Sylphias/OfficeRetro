require('dotenv').config();

const Telegraf = require('./functions/node_modules/telegraf');
const session = require('./functions/node_modules/telegraf/session');
const Stage = require('./functions/node_modules/telegraf/stage');

const { leave } = Stage;

const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Stage();
const { GroupCron, UserCron } = require('./devCrons');

const EmotionFeatures = require('./functions/BotFeatures/Emotion');
const CommonFeatures = require('./functions/BotFeatures/Common');
const FeedbackFeatures = require('./functions/BotFeatures/Feedback');

bot.use(session());
bot.use(stage.middleware());
stage.command('cancel', leave());

bot.use((ctx, next) => {
  // Debugging/loggin
  console.log(JSON.stringify({
    updateType: ctx.updateType,
    update: ctx.update,
  }));
  return next();
});

CommonFeatures(bot, stage);
FeedbackFeatures(bot, stage);
EmotionFeatures(bot, stage);

GroupCron();
UserCron();

bot.launch();
