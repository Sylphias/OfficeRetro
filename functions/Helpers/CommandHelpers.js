const Markup = require('telegraf/markup');

const isSameChat = (ctx) => {
  if (ctx.chat.id !== ctx.message.from.id) {
    // user is not in a private chat
    ctx.reply('This action requires you to be in a private chat window!', {
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
      // arg[1] = GroupSubscription.chatId
      // This is where the user submits the emotion record after
      // clicking the button from their main chats
      ctx.scene.enter('recordEmotjournal');
      break;
    case 'giveFeedback':
      ctx.scene.enter('feedbackEntry');
      break;
    default:
  }
};

module.exports = {
  isSameChat,
  startArgsHelper,
};
