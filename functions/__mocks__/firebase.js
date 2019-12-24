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
const groupGet = jest.fn(() => new Promise((resolve, reject) => {
  resolve({ docs: groupDocs });
}));
module.exports = {
  firestore: {
    collection: jest.fn((collectionName) => {
      switch (collectionName) {
        case 'user_subscriptions':
          return {
            get: jest.fn(() => ({
              docs: [
                {
                  chatId: '12341234',
                  chatTitle: 'TEST-01',
                },
              ],
            })),
          };
        case 'group_subscriptions':
          return {
            get: groupGet,
          };
        default:
          throw new Error('404: not found');
      }
    }),
  },
};
