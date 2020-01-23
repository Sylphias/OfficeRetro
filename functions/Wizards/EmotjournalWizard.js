const WizardScene = require('telegraf/scenes/wizard');
const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');

const CommandHelpers = require('../Helpers/CommandHelpers');
const EmotionRecord = require('../Classes/EmotionRecord');

const question = (ctx) => {
  ctx.reply('Reply with an emoji that best suits how you feel today!', {
    reply_markup: Markup.inlineKeyboard([
      [Markup.callbackButton('😖 - Stressed', '😖')],
      [Markup.callbackButton('🤬 - Frustrated', '🤬')],
      [Markup.callbackButton('😢 - Sad', '😢')],
      [Markup.callbackButton('😴 - Tired', '😴')],
      [Markup.callbackButton('😊 - Happy', '😊')],
    ]),
  });
  ctx.wizard.next();
};

// step 2
const handleAnswer = new Composer();
handleAnswer.on('callback_query', async (ctx) => {
  const query = ctx.callbackQuery;
  try {
    const emotionRecord = new EmotionRecord(ctx.message.from.id, query.data);
    await emotionRecord.save();
    CommandHelpers.updateCallbackMessage(query.from.id,
      query.message.message_id,
      'Thank you for sharing how you feel. A summary of your team\'s feelings will be shown later!');
  } catch (err) {
    ctx.reply(
      `Sorry, there was an error saving your record: ${err}`,
    );
  }
  ctx.scene.leave();
});

const EmotjournalStart = new WizardScene(
  'recordEmotjournal',
  question,
  handleAnswer,
);
module.exports = EmotjournalStart;
