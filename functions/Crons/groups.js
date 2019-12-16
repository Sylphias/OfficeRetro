const Telegram = require('telegraf/telegram');
const Markup = require('telegraf/markup');

const SubscriptionHelper = require('../Helpers/SubscriptionHelpers');
const GroupSubscription = require('../Classes/GroupSubscription');
const GroupEmotionSnapshot = require('../Classes/GroupEmotionSnapshot');
const { removeIndent } = require('../Helpers/TextHelpers');
const config = require('../config');

const telegramClient = new Telegram(config.botToken);

module.exports = {
  async dailyGroupEmotionMessage() {
    const groupQueryDocs = await SubscriptionHelper.GetActiveGroupSubscriptions();
    groupQueryDocs.map(async (queryDoc) => {
      const groupInfo = queryDoc.data();
      try {
        const group = new GroupSubscription(groupInfo.chatId, groupInfo.chatTitle);
        const emotionRecords = await group.getCurrentDayTeamEmotion();
        // create the snapshot for data analysis
        const grpSnapshot = new GroupEmotionSnapshot(group.chatId, emotionRecords);
        grpSnapshot.save();
        const emotionSummaryString = emotionRecords.reduce((accumulator, userEmotion) => `${accumulator} ${userEmotion.emotion}`, '');
        const message = emotionRecords.length === 0
          ? 'Sorry, nobody filled up their emotion journals just now... '
          : removeIndent`This is a summary of how your team felt today: ${emotionSummaryString}`;
        await telegramClient.sendMessage(groupInfo.chatId, message);
      } catch (err) {
        telegramClient.sendMessage(
          groupInfo.chatId,
          "Failed to retrieve team's emotional summary for today.",
        );
        console.error(err);
      }
    });
  },
  async groupRecordEmotion() {
    const groupDocs = await SubscriptionHelper.GetActiveGroupSubscriptions();
    groupDocs.map(async (doc) => {
      const groupInfo = doc.data();
      try {
        const msgInfo = await telegramClient.sendMessage(
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
          'group has not allowed the bot to converse with him/her, removing group from subscription',
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
};
