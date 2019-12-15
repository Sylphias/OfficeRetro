const { CronJob } = require('cron');
const Telegram = require('telegraf/telegram');
const Markup = require('telegraf/markup');

const bot = new Telegram(process.env.BOT_TOKEN);
const SubscriptionHelper = require('../Helpers/SubscriptionHelpers');
const { removeIndent } = require('../Helpers/TextHelpers');
const GroupSubscription = require('../Classes/GroupSubscription');

const DeclareGroupCronJobs = () => {
// 0 15 9 * * 1-5
  const GroupDailyEmotionMessage = new CronJob('*/10 * * * * 2-6',
    async () => {
      const groupQueryDocs = await SubscriptionHelper.GetActiveGroupSubscriptions();
      groupQueryDocs.map(async (queryDoc) => {
        const groupInfo = queryDoc.data();
        try {
          const group = new GroupSubscription(groupInfo.chatId, groupInfo.chatTitle);
          const emotions = await group.getCurrentDayTeamEmotion();
          const message = emotions.length === 0 ? 'Sorry, nobody filled up their emotion journals yesterday... '
            : removeIndent`This is a summary of how your team felt after yesterday:
      ${emotions}
      `;
          await bot.sendMessage(groupInfo.chatId, message);
        } catch (err) {
          bot.sendMessage(
            groupInfo.chatId,
            "Failed to retrieve team's emotional summary for today.",
          );
          console.error(err);
        }
      });
    },
    null,
    true,
    'Asia/Singapore');

  const GroupRecordEmotion = new CronJob(
    '*/10 * * * * 1-5',
    async () => {
      const groupDocs = await SubscriptionHelper.GetActiveGroupSubscriptions();
      groupDocs.map(async (doc) => {
        const groupInfo = doc.data();
        try {
          await bot.sendMessage(
            groupInfo.chatId,
            'Hello everybody! Time to do our daily team health updates, click on the button below to begin!',
            {
              reply_markup: {
                inline_keyboard: [
                  [Markup.urlButton('Lets begin! It will only take a second!', `${process.env.BOT_URL}?start=emotionJournal_${groupInfo.chatId.toString()}`)],
                ],
              },
            },
          );
        } catch (err) {
          console.error(
            'User has not allowed the bot to converse with him/her, removing user from subscription',
          );
          try {
            if (err.code === 403) {
              const group = new GroupSubscription(groupInfo.chatId, groupInfo.chatTitle);
              await group.unsubscribe();
              console.log('Successfully removed subscription');
            }
          } catch (error) {
            console.log('Error while trying to update subscription status');
            console.error(error);
          }
        }
      });
    },
    null,
    true,
    'Asia/Singapore',
  );
};

module.exports = DeclareGroupCronJobs;
