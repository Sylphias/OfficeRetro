// class Telegram {
//   constructor(config) {
//     this.config = config;
//     this.editMessageReplyMarkup = jest.fn();
//     this.editMessageText = jest.fn();
//   }
// }
const mockEditMessageReplyMarkup = jest.fn();
const mockEditMessageText = jest.fn();
const Telegram = jest.fn(() => ({
  editMessageReplyMarkup: mockEditMessageReplyMarkup,
  editMessageText: mockEditMessageText,
}));
module.exports = Telegram;
