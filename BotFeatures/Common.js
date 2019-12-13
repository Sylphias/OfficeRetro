const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Markup = require('telegraf/markup');

const { leave } = Stage;

const bot = new Telegraf(process.env.BOT_TOKEN);


const CmdHelpers = require('../Helpers/CommandHelpers');
const { removeIndent } = require('../Helpers/TextHelpers');

const welcomeMsg = removeIndent`
Hello there! This is Retro bot! Here are the commands you can use to start collecting feedback:

----- Group Commands -----
/startSession <Session Title> - starts a new feedback session with a default questionnaire (eg /startSession Sprint retro 29th aug)
/start <feedback-id> - starts a feedback entry for a particular session
/startTeamEmotionJournal - Subscribe to daily team emotion monitoring

----- Private Commands (1-1 chat with bot) -----
/subscribe - be able to record a daily emotion journal
/unsubscribe - stop doing daily emotion journaling
`;

const InitializeCommonFunctions = () => {
  bot.command('help', (ctx) => {
    ctx.reply(welcomeMsg);
  });

  bot.start((ctx) => {
    const args = ctx.message.text.split(' ');
    if (args.length === 1) {
      return ctx.reply(welcomeMsg);
    }
    const subArgs = args[1].split('_');
    switch (subArgs.length) {
      case 2:
        CmdHelpers.startArgsHelper(subArgs, ctx);
        break;
      case 1:
        ctx.scene.enter('feedbackEntry');
        break;
      default:
        ctx.reply(welcomeMsg, { parse_mode: 'html' });
    }
  });
};

module.exports = InitializeCommonFunctions;
