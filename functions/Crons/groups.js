const Telegram = require('telegraf/telegram');
const Markup = require('telegraf/markup');

const SubscriptionHelper = require('../Helpers/SubscriptionHelpers');
const GroupSubscription = require('../Classes/GroupSubscription');
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
        const emotions = await group.getCurrentDayTeamEmotion();
        const message = emotions.length === 0
          ? 'Sorry, nobody filled up their emotion journals yesterday... '
          : removeIndent`This is a summary of how your team felt after yesterday: ${emotions}`;
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
        await telegramClient.sendMessage(
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
};