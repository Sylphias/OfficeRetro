const groupDocs = [
  {
    chatId: '12341234',
    chatTitle: 'TEST-01',
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
