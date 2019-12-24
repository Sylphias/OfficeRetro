const { firestore } = require('../../firebase');
const SubscriptionHelper = require('../../Helpers/SubscriptionHelpers');

jest.mock('../../firebase');
const groupDocs = [
  {
    chatId: '12341234',
    chatTitle: 'TEST-01',
  },
  {
    chatId: '222222222',
    chatTitle: 'TEST-02',
  },
  {
    chatId: '22222222',
    chatTitle: 'TEST-03',
  },
];

describe('Subscription helpers should help retrieve valid subscriptions to the emotjournal', () => {
  test('Group Subscriptions should retrieve a list of active Group subscriptions', async () => {
    const test = await SubscriptionHelper.GetActiveGroupSubscriptions();
    expect(firestore.collection).toBeCalledWith('group_subscriptions');
    expect(firestore.collection('group_subscriptions').get).toBeCalledTimes(1);
    expect(test).toEqual(groupDocs);
  });
  test('User Subscriptions should retrieve a list of active group subscriptons', async () => {
    // TODO: Feature not implemented
  });
});
