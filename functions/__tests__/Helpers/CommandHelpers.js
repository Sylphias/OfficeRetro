const Telegram = require('telegraf/telegram');
const CommandHelpers = require('../../Helpers/CommandHelpers');

jest.mock('telegraf/telegram');
const telegramClient = new Telegram();

describe('Command Helpers should have operations that assist in carrying bot commands', () => {
  beforeEach(() => {
    telegramClient.editMessageReplyMarkup.mockClear();
    telegramClient.editMessageText.mockClear();
  });
  test('updateCallbackMessage should call telegramClient to update previous message',
    async () => {
      await CommandHelpers.updateCallbackMessage('111', '222', 'test');
      expect(telegramClient.editMessageReplyMarkup).toBeCalledTimes(1);
      expect(telegramClient.editMessageText).toBeCalledTimes(1);
    });
});
