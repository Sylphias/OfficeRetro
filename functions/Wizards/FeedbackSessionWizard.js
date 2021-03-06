const WizardScene = require('telegraf/scenes/wizard');
const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');

const FeedbackSession = require('../Classes/FeedbackSession');

const createFeedbackSession = new Composer();

const requestFeedbackSessionName = (ctx) => {
  ctx.reply('Hello! To begin a feedback session, please enter a session name!');
  return ctx.wizard.next();
};
createFeedbackSession.on('message', async (ctx) => {
  const msgInfo = ctx.message.from;
  const fbs = new FeedbackSession({
    userId: msgInfo.id,
    username: msgInfo.username,
    name: msgInfo.first_name,
    title: ctx.message.text,
  });
  const doc = await fbs.create();
  ctx.reply('Please click on the button below to submit your feedback! Wait for the send feedback privately button to appear!', {
    reply_markup: Markup.inlineKeyboard([
      Markup.switchToCurrentChatButton('Give Feedback', doc.id.toString()),
    ]),
  });
  return ctx.scene.leave();
});

const StartFeedbackSession = new WizardScene('feedbackStart',
  requestFeedbackSessionName,
  createFeedbackSession);

module.exports = StartFeedbackSession;
