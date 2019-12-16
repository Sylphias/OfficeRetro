const { EmotjournalWizard, GroupEmotjournalWizard } = require('../Wizards');
const CmdHelpers = require('../Helpers/CommandHelpers');
const { removeIndent } = require('../Helpers/TextHelpers');
const UserSubscription = require('../Classes/UserSubscription');
const GroupSubscription = require('../Classes/GroupSubscription');

const subscribeGroup = async (ctx) => {
  const group = await GroupSubscription.get(ctx.chat.id);
  try {
    if (group) {
      return ctx.reply('Sorry, you have already been subscribed!');
    }
    const newGroup = new GroupSubscription(ctx.chat.id, ctx.chat.title);
    await newGroup.create();
    return ctx.reply(removeIndent`This group has been subscribed to the Emotjournal. you will now receive daily emotional journaling and roundups!`);
  } catch (err) {
    return ctx.reply(
      'Sorry, there was an issue subscribing the group. Please try again!',
    );
  }
};

const subscribeUser = async (ctx) => {
  const user = UserSubscription.get(ctx.message.from.id);
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
};

const subscribeToEmotionJournaling = async (ctx) => {
  // check if its a private chat
  if (!CmdHelpers.isSameChat(ctx)) {
    await subscribeGroup(ctx);
  } else {
    await subscribeUser(ctx);
  }
};

const unsubscribeGroup = async (ctx) => {
  const group = new GroupSubscription(ctx.chat.id);
  try {
    await group.delete();
    ctx.reply('This group has been unsubscribed from the Emotjournal!');
  } catch (err) {
    ctx.reply(
      'Sorry, there was an issue unsubscribing the group. Please try again!',
    );
  }
};

const unsubscribeUser = async (ctx) => {
  const user = new UserSubscription(ctx.message.from);
  try {
    await user.delete();
    ctx.reply('You have been unsubscribed from the Emotjournal!');
  } catch (err) {
    ctx.reply(
      'Sorry, there was an issue updating your Subscription. Please try again!',
    );
  }
};

const unsubscribeToEmotionJournaling = async (ctx) => {
  if (!CmdHelpers.isSameChat(ctx)) {
    unsubscribeGroup(ctx);
  } else {
    unsubscribeUser(ctx);
  }
};

const InitializeEmotionFunction = (bot, stage) => {
  stage.register(EmotjournalWizard);
  stage.register(GroupEmotjournalWizard);

  bot.action('update_emotjournal', async (ctx) => ctx.scene.enter('recordEmotjournal'));

  bot.command('subscribe', subscribeToEmotionJournaling);
  bot.command('unsubscribe', unsubscribeToEmotionJournaling);
};

module.exports = InitializeEmotionFunction;
