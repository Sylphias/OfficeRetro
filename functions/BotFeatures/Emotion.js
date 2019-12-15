const Markup = require('telegraf/markup');

const EmotjournalWizard = require('../Wizards/EmotjournalWizard');
const CmdHelpers = require('../Helpers/CommandHelpers');
const { removeIndent } = require('../Helpers/TextHelpers');
const UserSubscription = require('../Classes/UserSubscription');
const GroupSubscription = require('../Classes/GroupSubscription');

const InitializeEmotionFunction = (bot, stage) => {
  stage.register(EmotjournalWizard);

  bot.action('update_emotjournal', async (ctx) => {
    ctx.scene.enter('recordEmotjournal');
  });

  bot.command('subscribe', async (ctx) => {
    // check if its a private chat
    if (!CmdHelpers.isSameChat(ctx)) {
      return CmdHelpers.redirectToPrivateChat(ctx);
    }
    // if in private chat, add user to firestore.
    const user = await UserSubscription.get(ctx.message.from.id);
    try {
      if (user) {
        return ctx.reply('Sorry, you have already been subscribed!');
      }
      const newUser = new UserSubscription(ctx.message.from);
      await newUser.create();
      return ctx.reply('You have been subscribed to the Emotjournal!');
    } catch (err) {
      return ctx.reply(
        'Sorry, there was an issue updating your Subscription. Please try again!',
      );
    }
  });

  bot.command('unsubscribe', async (ctx) => {
    if (!CmdHelpers.isSameChat(ctx)) {
      return CmdHelpers.redirectToPrivateChat(ctx);
    }
    const user = new UserSubscription(ctx.message.from);
    try {
      await user.delete();
      return ctx.reply('You have been unsubscribed from the Emotjournal!');
    } catch (err) {
      return ctx.reply(
        'Sorry, there was an issue updating your Subscription. Please try again!',
      );
    }
  });

  bot.command('startTeamEmotionJournal', async (ctx) => {
    // create a group chat object, if it already exists then return the groupchat
    const grpChat = new GroupSubscription(ctx.chat.id);
    try {
      await grpChat.create();
    } catch (err) {
      return ctx.reply('Error Registering Group, please try again!');
    }
    return ctx.reply(
      removeIndent`This team will now receive daily emotional roundups!
    To subscribe to a daily`,
      {
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.urlButton(
              'Register to Team',
              `${
                process.env.BOT_URL
              }?start=emotionJournal_${grpChat.chatId.toString()}`,
            ),
          ],
        ]),
      },
    );
  });
};

module.exports = InitializeEmotionFunction;
