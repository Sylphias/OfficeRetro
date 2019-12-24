const { firestore } = require('../../firebase');
const SubscriptionHelper = require('../../Helpers/SubscriptionHelpers');

jest.mock('../../firebase');

describe('Subscription helpers should help retrieve valid subscriptions to the emotjournal', () => {
  test('Group Subscriptions should retrieve a list of active Group subscriptions', async () => {
    const test = await SubscriptionHelper.GetActiveGroupSubscriptions();
    expect(firestore.collection).toBeCalledWith('group_subscriptions');
    expect(firestore.collection('group_subscriptions').get).toBeCalledTimes(1);
    expect(test).toEqual([{
      chatId: '12341234',
      chatTitle: 'TEST-01',
    }]);
  });
});
