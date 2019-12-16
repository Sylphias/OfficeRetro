const Telegram = require('telegraf/telegram');
const config = require('../config');

const telegramClient = new Telegram(config.botToken);

const updateCallbackMessage = (chatId, messageId, text) => {
  telegramClient.editMessageReplyMarkup(chatId, messageId);
  telegramClient.editMessageText(chatId, messageId, null, text);
};

const deleteMessage = (chatId, messageId) => {
  telegramClient.deleteMessage(chatId, messageId);
};

const isSameChat = (ctx) => ctx.chat.id === ctx.message.from.id;
// user is not in a private chat
// ctx.reply('This action requires you to be in a private chat window!', {
//   reply_markup: Markup.inlineKeyboard([[
//     Markup.urlButton('Click here to open a private chat', `${process.env.BOT_URL}`),
//   ]]),
// });
const startArgsHelper = async (arg, ctx) => {
  switch (arg[0]) {
    case 'emotionJournal':
      // arg[1] = GroupSubscription.chatId
      // This is where the user submits the emotion record after
      // clicking the button from their main chats
      return ctx.scene.enter('recordGroupEmotjournal', { chatId: arg[1] });
    case 'giveFeedback':
      return ctx.scene.enter('feedbackEntry');
    default:
  }
};

module.exports = {
  isSameChat,
  startArgsHelper,
  updateCallbackMessage,
  deleteMessage,
};
