require('dotenv').config();
const Markup = require('telegraf/markup');

const UserSubscription = require('../Classes/UserSubscription');
const GroupSubscription = require('../Classes/GroupSubscription');

const isSameChat = (ctx) => {
  if (ctx.chat.id !== ctx.message.from.id) {
    // user is not in a private chat
    ctx.reply('Please subscribe to me in a private chat window', {
      reply_markup: Markup.inlineKeyboard([[
        Markup.urlButton('Click here to open a private chat', `${process.env.BOT_URL}`),
      ]]),
    });
    return false;
  }
  return true;
};

const startArgsHelper = async (arg, ctx) => {
  switch (arg[0]) {
    case 'emotionJournal':
      // check if its a private chat
      if (!isSameChat(ctx)) {
        return;
      }
      // if in private chat, add user to firestore.
      try {
        // check if user is already recording emotion
        let user = await UserSubscription.get(ctx.message.from.id);
        if (!user) {
          user = new UserSubscription(ctx.message.from);
          await user.create();
        }
        const grpSub = await GroupSubscription.get(arg[1]);
        if (!grpSub) {
          ctx.reply('Sorry, the link is no longer valid, go back to the main chat and type /startTeamEmotionJournal to subscribe again');
        }
        await grpSub.subscribeUser(ctx.message.from.id);
        ctx.reply('You have been subscribed to the Emotjournal!');
      } catch (err) {
        ctx.reply(
          `Sorry, there was an issue updating your Subscription! ${err}`,
        );
        console.error(err);
      }
      break;
    default:
  }
};

module.exports = {
  isSameChat,
  startArgsHelper,
};
