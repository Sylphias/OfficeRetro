const WizardScene = require('telegraf/scenes/wizard');
const Composer = require('telegraf/composer');
const createFeedbackSession = new Composer();
const Markup = require('telegraf/markup');

const FeedbackSession = require('../Classes/FeedbackSession')

const requestFeedbackSessionName = (ctx) => {
  ctx.reply('Hello! To begin a feedback session, please enter a session name!');
  ctx.wizard.next();
}
createFeedbackSession.on('text',async (ctx) => {
  const msgInfo = ctx.message.from
  const fbs = new FeedbackSession(msgInfo.id,msgInfo.username,msgInfo.first_name,ctx.message.text)
  const doc = await fbs.save();
  ctx.reply('Please click on the button below to submit your feedback! Wait for the send feedback privately button to appear!', {
    reply_markup: Markup.inlineKeyboard([
      Markup.switchToCurrentChatButton('Give Feedback',doc.id.toString()),
    ]),
  });
  ctx.scene.leave();
})

const StartFeedbackSession = new WizardScene('feedbackStart',
  requestFeedbackSessionName,
  createFeedbackSession
  );

module.exports = StartFeedbackSession
