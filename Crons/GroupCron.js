const { CronJob } = require('cron');
const Telegram = require('telegraf/telegram');
const Markup = require('telegraf/markup');

const bot = new Telegram(process.env.BOT_TOKEN);
const SubscriptionHelper = require('../Helpers/SubscriptionHelpers');
const { removeIndent } = require('../Helpers/TextHelpers');
const GroupSubscription = require('../Classes/GroupSubscription');

const DeclareGroupCronJobs = () => {
// 0 15 9 * * 1-5
  const GroupDailyEmotionMessage = new CronJob('0 15 9 * * 2-6',
    async () => {
      const groupQueryDocs = await SubscriptionHelper.GetActiveGroupSubscriptions();
      groupQueryDocs.map(async (queryDoc) => {
        try {
          const groupInfo = queryDoc.data();
          const group = new GroupSubscription(groupInfo.chatId, groupInfo.subscribedUsers);
          const emotions = await group.getCurrentDayTeamEmotion();
          const message = emotions.length === 0 ? 'Sorry, nobody filled up their emotion journals yesterday... '
            : removeIndent`This is a summary of how your team felt after yesterday:
      ${emotions}
      `;
          await bot.sendMessage(groupInfo.chatId, message);
        } catch (err) {
          bot.sendMessage(
            "Failed to retrieve team's emotional summary for today.",
          );
          console.error(err);
        }
      });
    },
    null,
    true,
    'Asia/Singapore');
};

module.exports = DeclareGroupCronJobs;
