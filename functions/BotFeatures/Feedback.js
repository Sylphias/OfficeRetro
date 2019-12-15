
const Markup = require('telegraf/markup');

const FeedbackEntry = require('../Wizards/FeedbackEntryWizard');
const FeedbackSession = require('../Classes/FeedbackSession');

const InitializeFeedbackFunctions = (bot, stage) => {
  stage.register(FeedbackEntry);

  bot.command('startSession', async (ctx) => {
    // get title
    const matches = ctx.message.text.match(/[^ ]* (.*)/);
    if (!matches) {
      return ctx.reply(
        'Input error: You should start a session like so -> /startSession <Session Title> - starts a new feedback session (eg /startSession Sprint retro 29th aug)',
      );
    }
    const msgInfo = ctx.message.from;
    const feedbackSesh = new FeedbackSession(
      msgInfo.id,
      msgInfo.username,
      msgInfo.first_name,
      matches[1],
    );
    const doc = await feedbackSesh.save();
    return ctx.reply(
      'Please click on the button below to submit your feedback! Once you are in a private chat with the bot, click start to begin!',
      {
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.urlButton(
              'Give Feedback',
              `${process.env.BOT_URL}?start=giveFeedback_${doc.id.toString()}`,
            ),
          ],
        ]),
      },
    );
  });
};

module.exports = InitializeFeedbackFunctions;
