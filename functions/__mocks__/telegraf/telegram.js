// class Telegram {
//   constructor(config) {
//     this.config = config;
//     this.editMessageReplyMarkup = jest.fn();
//     this.editMessageText = jest.fn();
//   }
// }
const mockEditMessageReplyMarkup = jest.fn((chatId, messageId) => {
  if (!chatId || !messageId) {
    throw new Error('Unable to connect to telegram');
  }
});
const mockEditMessageText = jest.fn((chatId, messageId, instance, text) => {
  if (!chatId || !messageId) {
    throw new Error('Unable to connect to telegram');
  }
});
const Telegram = jest.fn(() => ({
  editMessageReplyMarkup: mockEditMessageReplyMarkup,
  editMessageText: mockEditMessageText,
}));
module.exports = Telegram;
