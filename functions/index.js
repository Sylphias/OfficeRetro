const functions = require('firebase-functions');
const Telegram = require('telegraf/telegram');
const Markup = require('telegraf/markup');

const bot = require('./bot');
const SubscriptionHelper = require('./Helpers/SubscriptionHelpers');
const User = require('./Classes/UserSubscription');
const { removeIndent } = require('./Helpers/TextHelpers');
const GroupSubscription = require('./Classes/GroupSubscription');
const config = require('./config');

const telegramClient = new Telegram(config.botToken);

exports.mysecretbotendpoint = functions
  .region('asia-east2')
  .https.onRequest(async (req, res) => {
    if (req.method.toLowerCase() !== 'post' || req.url !== '/') {
      return res.status(403).send();
    }
    const update = req.body;
    if (update == null) {
      return res.status(415).send();
    }
    try {
      // Goes through all bot middlewares
      // Will send response if valid.
      await bot.handleUpdate(update, res);
      if (!res.headersSent) {
        // If not handled by bot, need to return success to telegram
        return res.send({ handled: true });
      }
      // Theoretically shouldn't happen.
      return res.status(500).send();
    } catch (err) {
      console.error(err.message);
      return res.status(500).send(err.message);
    }
  });

exports.scheduledUserActions = functions.pubsub
  .schedule('15 17 * * 1-5')
  .timeZone('Asia/Singapore')
  .onRun(async () => {
    const userDocs = await SubscriptionHelper.GetActiveSubscriptionsUserId();
    userDocs.map(async (doc) => {
      const user = new User(doc.data());
      try {
        await telegramClient.sendMessage(
          user.userId,
          `Hello there ${user.first_name}! Would you like record how you are feeling today?`,
          {
            reply_markup: {
              inline_keyboard: [
                [Markup.callbackButton('Yes!', 'update_emotjournal')],
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
            await user.unsubscribe();
            console.log('Successfully removed subscription');
          }
        } catch (subscriptionError) {
          console.log('Error while trying to update subscription status');
          console.error(subscriptionError);
        }
      }
    });
  });

exports.scheduledGroupActions = functions.pubsub
  .schedule('15 17 * * 1-5')
  .timeZone('Asia/Singapore')
  .onRun(async () => {
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
  });
