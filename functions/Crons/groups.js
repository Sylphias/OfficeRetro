const Telegram = require('telegraf/telegram');
const Markup = require('telegraf/markup');

const SubscriptionHelper = require('../Helpers/SubscriptionHelpers');
const GroupSubscription = require('../Classes/GroupSubscription');
const GroupEmotionSnapshot = require('../Classes/GroupEmotionSnapshot');
const { removeIndent } = require('../Helpers/TextHelpers');
const config = require('../config');

const telegramClient = new Telegram(config.botToken);

const unsubscribeIfForbidden = async (groupInfo, err) => {
  try {
    // Error 400 in this case means that the bot is looking at a record that was entered by another bot.
    // This should never be the case in production but is handled anyways.
    if (err.code === 403 || (err.code === 400 && /[.]*(chat not found)[.]*/.test(err.message))) {
      console.error(
        'group has not allowed the bot to converse with him/her, removing group from subscription',
      );
      const group = new GroupSubscription(groupInfo.chatId, groupInfo.chatTitle);
      await group.delete();
      console.log('Successfully removed subscription');
    } else {
      telegramClient.sendMessage(
        groupInfo.chatId,
        "Failed to retrieve team's emotional summary for today.",
      );
    }
  } catch (error) {
    console.log('Error while trying to update subscription status');
    console.error(error);
  }
};

module.exports = {
  async dailyGroupEmotionMessage(daysAgo) {
    try {
      const groupQueryDocs = await SubscriptionHelper.GetActiveGroupSubscriptions();
      groupQueryDocs.map(async (queryDoc) => {
        const groupInfo = queryDoc.data();
        try {
          const group = new GroupSubscription(groupInfo.chatId, groupInfo.chatTitle);
          const emotionRecords = await group.getCurrentDayTeamEmotion(daysAgo);
          // create the snapshot for data analysis
          const grpSnapshot = new GroupEmotionSnapshot(group.chatId, emotionRecords);
          grpSnapshot.save();
          const emotionSummaryString = emotionRecords.reduce((accumulator, userEmotion) => `${accumulator} ${userEmotion.emotion}`, '');
          const message = emotionRecords.length === 0
            ? 'Sorry, nobody filled up their emotion journals yesterday... '
            : removeIndent`This is a summary of how your team felt yesterday: ${emotionSummaryString}`;
          await telegramClient.sendMessage(groupInfo.chatId, message);
        } catch (err) {
          console.error(err);
          await unsubscribeIfForbidden(groupInfo, err);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
  async groupRecordEmotion() {
    try {
      const groupDocs = await SubscriptionHelper.GetActiveGroupSubscriptions();
      groupDocs.map(async (doc) => {
        const groupInfo = doc.data();
        try {
          const msgInfo = await telegramClient.sendMessage(
            groupInfo.chatId,
            'Hello everybody! Time to do our daily team health updates, click on the button below to begin!',
            {
              reply_markup: Markup.inlineKeyboard(
                [[Markup.urlButton('Lets begin! It will only take a second!', `${config.botUrl}?start=emotionJournal_${groupInfo.chatId.toString()}`)]],
              ),
            },
          );
        } catch (err) {
          unsubscribeIfForbidden(groupInfo, err);
          console.error(err);
        }
      });
    } catch (err) {
      console.error(err);
    }
  },
};
