const Telegram = require('telegraf/telegram');
const CommandHelpers = require('../../Helpers/CommandHelpers');

jest.mock('telegraf/telegram');

describe('Command Helpers should have operations that assist in carrying bot commands', () => {
  test('updateCallbackMessage should call telegramClient to update previous message',
    () => {
      CommandHelpers.updateCallbackMessage('111', '222', 'test');
      console.log(Telegram);
      expect(Telegram).toBeCalled();
      expect(Telegram.editMessageReplyMarkup).toBeCalled();
    });
});
