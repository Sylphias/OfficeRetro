const Telegram = jest.fn().mockImplementation(() => ({
  editMessageReplyMarkup: jest.fn(),
  editMessageText: jest.fn(),
}));
module.exports = Telegram;
