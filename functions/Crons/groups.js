const Telegram = require('telegraf/telegram');

const SubscriptionHelper = require('../Helpers/SubscriptionHelpers');
const GroupSubscription = require('../Classes/GroupSubscription');
const { removeIndent } = require('../Helpers/TextHelpers');
const config = require('../config');

const telegramClient = new Telegram(config.botToken);

module.exports = {
  async updateTeamEmoteJournal() {
    const groupQueryDocs = await SubscriptionHelper.GetActiveGroupSubscriptions();
    groupQueryDocs.map(async (queryDoc) => {
      try {
        const groupInfo = queryDoc.data();
        const group = new GroupSubscription(
          groupInfo.chatId,
          groupInfo.subscribedUsers,
        );
        const emotions = await group.getCurrentDayTeamEmotion();
        const message = emotions.length === 0
          ? 'Sorry, nobody filled up their emotion journals yesterday... '
          : removeIndent`This is a summary of how your team felt after yesterday:
      ${emotions}
      `;
        await telegramClient.sendMessage(groupInfo.chatId, message);
      } catch (err) {
        telegramClient.sendMessage(
          "Failed to retrieve team's emotional summary for today.",
        );
        console.error(err);
      }
    });
  },
};
