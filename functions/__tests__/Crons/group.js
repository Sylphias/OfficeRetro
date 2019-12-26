const Telegram = require('telegraf/telegram');
const Markup = require('telegraf/markup');

const SubscriptionHelper = require('../Helpers/SubscriptionHelpers');
const GroupSubscription = require('../Classes/GroupSubscription');
const GroupEmotionSnapshot = require('../Classes/GroupEmotionSnapshot');
const { removeIndent } = require('../Helpers/TextHelpers');

jest.mock('../Helpers/SubscriptionHelpers');
jest.mock('telegraf/telegram');
jest.mock('../Classes/GroupSubscription');
jest.mock('../Classes/GroupEmotionSnapshot');
jest.mock('../Helpers/TextHelpers');
const telegramClient = new Telegram();
const groupInfo1 = {
  chatId: '111111',
  chatTite: 'Testing',
};
const err1 = {
  code: 403,
};
const groupInfo2 = {
  chatId: '222222',
  chatTite: 'Testing2',
};
const err2 = {
  code: 400,
};
describe('group.js should perform cron functions that will message the group at specific time intervals', () => {
  test('unsubscribeIfForbidden should delete a groupSubscription if error code is 403 or 400',
    async () => {
      await unsubscribeIfForbidden(groupInfo1, err1);
    });
});
