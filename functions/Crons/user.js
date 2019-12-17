const Telegram = require('telegraf/telegram');
const Markup = require('telegraf/markup');

const SubscriptionHelper = require('../Helpers/SubscriptionHelpers');
const User = require('../Classes/UserSubscription');
const config = require('../config');


const telegramClient = new Telegram(config.botToken);

module.exports = {
  async updateUserEmoteJournal() {
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
  },
};
