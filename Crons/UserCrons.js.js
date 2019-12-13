const { CronJob } = require('cron');
const Telegram = require('telegraf/telegram');
const Markup = require('telegraf/markup');

const bot = new Telegram(process.env.BOT_TOKEN);
const SubscriptionHelper = require('../functions/Helpers/SubscriptionHelpers');
const User = require('../functions/Classes/UserSubscription');

const DeclareUserCronJobs = () => (
  new CronJob(
    '0 15 17 * * 1-5',
    async () => {
      const userDocs = await SubscriptionHelper.GetActiveSubscriptionsUserId();
      userDocs.map(async (doc) => {
        const user = new User(doc.data());
        try {
          await bot.sendMessage(
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
          } catch (err) {
            console.log('Error while trying to update subscription status');
            console.error(err);
          }
        }
      });
    },
    null,
    true,
    'Asia/Singapore',
  ));
module.exports = { DeclareUserCronJobs };
