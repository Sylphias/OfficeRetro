
const Markup = require('telegraf/markup');

const FeedbackEntry = require('../Wizards/FeedbackEntryWizard');
const FeedbackSession = require('../Classes/FeedbackSession');
const config = require('../config');

const InitializeFeedbackFunctions = (bot, stage) => {
  stage.register(FeedbackEntry);
  bot.action(/^displayFeedbackResponses_*/, async (ctx) => {
    const data = ctx.callbackQuery.data.split('_');
    // If no doc ID, end transaction
    if (data.length < 2) {
      return ctx.reply('Error: Invalid feedback session, unable to retrieve data');
    }
    // retrieve the session
    const fbSesh = new FeedbackSession({ uuid: data[1] });
    try {
      await fbSesh.get();
      const message = await fbSesh.showSessionResponses();
      ctx.reply(message, { parse_mode: 'html' });
    } catch (error) {
      console.error(error);
      ctx.reply('Sorry, there was an error retrieving session information! Please try again later!');
    }
  });
  bot.command('startSession', async (ctx) => {
    // get title
    const matches = ctx.message.text.match(/[^ ]* (.*)/);
    if (!matches) {
      return ctx.reply(
        'Input error: You should start a session like so -> /startSession <Session Title> - starts a new feedback session (eg /startSession Sprint retro 29th aug)',
      );
    }
    const msgInfo = ctx.message.from;
    const feedbackSesh = new FeedbackSession({
      userId: msgInfo.id,
      username: msgInfo.username,
      name: msgInfo.first_name,
      title: matches[1],
    });
    try {
      await feedbackSesh.create();
    } catch (err) {
      console.error(err);
      ctx.reply('There was an error creating the feedback session, please try again later!');
    }
    return ctx.reply(
      'Please click on the button below to submit your feedback! Once you are in a private chat with the bot, click start to begin!',
      {
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.urlButton(
              'Give Feedback',
              `${config.botUrl}?start=giveFeedback_${feedbackSesh.uuid.toString()}`,
            ),
          ],
          [
            Markup.callbackButton(
              'View Feedback Responses',
              `displayFeedbackResponses_${feedbackSesh.uuid.toString()}`,
            ),
          ],
        ]),
      },
    );
  });
};

module.exports = InitializeFeedbackFunctions;
