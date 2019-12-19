const WizardScene = require('telegraf/scenes/wizard');
const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');

const RemoveIndent = require('../Helpers/TextHelpers').removeIndent;
const CommandHelpers = require('../Helpers/CommandHelpers');
const FeedbackEntry = require('../Classes/FeedbackEntry');

const cancel = async (ctx) => {
  await CommandHelpers.updateCallbackMessage(ctx.chat.id, ctx.scene.session.currentMessageId, 'Feedback session ended!');
  ctx.reply(
    RemoveIndent`Cancelling Feedback, you can start again by clicking on the Give Feedback button!`,
  );
  ctx.scene.leave();
};

const submit = async (ctx) => {
  await ctx.scene.session.entry.save();
  await CommandHelpers.updateCallbackMessage(ctx.chat.id, ctx.scene.session.currentMessageId, 'Feedback session ended!');
  ctx.reply(RemoveIndent`
    Thank you for sending in your feedback!
  `);
  ctx.scene.leave();
};

const question1 = async (ctx) => {
  const args = ctx.message.text.split('_');
  const info = ctx.message.from;
  ctx.webhookReply = false;
  const sessionId = args[1];
  // create the entry object
  const feedbackEntry = new FeedbackEntry(info.id, info.username, sessionId);
  ctx.scene.session.entry = feedbackEntry;
  const q1Msg = await ctx.reply(
    RemoveIndent`Hello There! Thank you for taking some time to fill in this feedback. 
  If at any time you wish to cancel, press the cancel button or type /cancel
  -------
  Question 1:
  How do you feel about this week's work in your team?
  `,
    {
      parse_mode: 'html',
      reply_markup: Markup.inlineKeyboard([
        [Markup.callbackButton('😊', '😊'), Markup.callbackButton('😞', '😞')],
        [Markup.callbackButton('🤬', '🤬'), Markup.callbackButton('😢', '😢')],
      ]),
    },
  );
  ctx.scene.session.messageId = q1Msg.message_id;
  ctx.wizard.next();
};
// step 2
const question2 = new Composer();
question2.command('cancel', cancel);
question2.on('callback_query', async (ctx) => {
  // Process the reply from first question
  ctx.webhookReply = false;
  const feedbackEntry = ctx.scene.session.entry;
  feedbackEntry.addResponse(
    "How do you feel about this week's work",
    ctx.callbackQuery.data,
  );

  // Edit previous response
  await CommandHelpers.updateCallbackMessage(ctx.chat.id, ctx.scene.session.messageId, 'Thank you for answering the question!');
  const q2Msg = await ctx.reply(
    RemoveIndent`Question 2:
  If there was one thing that can be done better this week, what would it be?`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            Markup.callbackButton('End Feedback', 'endFeedback'),
            Markup.callbackButton('Cancel', 'cancel'),
          ],
        ],
      },
    },
  );
  ctx.scene.session.messageId = q2Msg.message_id;
  ctx.wizard.next();
});
const question3 = new Composer();

question3.action('endFeedback', submit);
question3.action('cancel', cancel);
question2.command('cancel', cancel);
question3.on('text', async (ctx) => {
  ctx.webhookReply = false;
  await CommandHelpers.updateCallbackMessage(ctx.chat.id, ctx.scene.session.messageId, 'Thank you for answering the question!');
  const feedbackEntry = ctx.scene.session.entry;
  feedbackEntry.addResponse(
    'If there was one thing that can be done better this week, what would it be?',
    ctx.message.text,
  );
  const q3Msg = await ctx.reply(
    RemoveIndent`Question 3:
  Why so? (Provide more context and information)`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            Markup.callbackButton('End Feedback', 'endFeedback'),
            Markup.callbackButton('Cancel', 'cancel'),
          ],
        ],
      },
    },
  );
  ctx.scene.session.messageId = q3Msg.message_id;
  ctx.wizard.next();
});

const endFeedbackEntry = new Composer();
endFeedbackEntry.action('endFeedback', submit);
endFeedbackEntry.action('cancel', cancel);
endFeedbackEntry.command('cancel', cancel);
endFeedbackEntry.on('text', async (ctx) => {
  await CommandHelpers.updateCallbackMessage(ctx.chat.id, ctx.scene.session.messageId, 'Thank you for answering the question!');
  const feedbackEntry = ctx.scene.session.entry;
  feedbackEntry.addResponse(
    'Why so? (Provide more context and information)',
    ctx.message.text,
  );
  await feedbackEntry.save();
  ctx.reply('Thank you for filling up this feedback!');
  ctx.scene.leave();
});

const StartFeedbackEntryWizard = new WizardScene(
  'feedbackEntry',
  question1,
  question2,
  question3,
  endFeedbackEntry,
);
module.exports = StartFeedbackEntryWizard;
