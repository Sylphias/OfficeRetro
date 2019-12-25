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
      expect(telegramClient.editMessageReplyMarkup.mock.calls).toEqual([['111', '222']]);
      expect(telegramClient.editMessageText.mock.calls).toEqual([['111', '222', null, 'test']]);
    });

  test('When any of the telegram requests in updateCallbackMessage fail, method should catch the error', async () => {
    const test = await CommandHelpers.updateCallbackMessage();
    expect(test).toBeFalsy();
    expect(telegramClient.editMessageReplyMarkup.mock.calls.length).toEqual(1);
  });

  test('isSameChat should ensure that the chatId and sender Id is the same to determine if chat is a private chat',
    () => {
      const ctx1 = { chat: { id: 1 }, message: { from: { id: 1 } } };
      const ctx2 = { chat: { id: 2 }, message: { from: { id: 1 } } };
      expect(CommandHelpers.isSameChat(ctx1)).toBeTruthy();
      expect(CommandHelpers.isSameChat(ctx2)).toBeFalsy();
    });
  test('isSameChat should throw an error if no input or malformed input is entered',
    () => {
      expect(() => { CommandHelpers.isSameChat(); }).toThrow(TypeError);
    });
});
