const CmdHelpers = require('../Helpers/CommandHelpers');
const { removeIndent } = require('../Helpers/TextHelpers');

const welcomeMsg = removeIndent`
Hello there! This is Retro bot! Here are the commands you can use to start collecting feedback:

----- Group Commands -----
/start,/help - Displays the commands that this bt has.
/startSession <Session Title> - starts a new feedback session with a default questionnaire (eg /startSession Sprint retro 29th aug)
/subscribe - be able to record a daily emotion journal for the group
/unsubscribe - stop doing daily emotion journaling

`;

const InitializeCommonFunctions = (bot) => {
  bot.command('help', (ctx) => {
    ctx.reply(welcomeMsg);
  });

  bot.start((ctx) => {
    const args = ctx.message.text.split(' ');
    if (args.length === 1) {
      return ctx.reply(welcomeMsg);
    }
    const subArgs = args[1].split('_');
    return CmdHelpers.startArgsHelper(subArgs, ctx);
  });
};

module.exports = InitializeCommonFunctions;
