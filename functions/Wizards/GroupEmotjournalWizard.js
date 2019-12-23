const WizardScene = require('telegraf/scenes/wizard');
const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');
const CommandHelpers = require('../Helpers/CommandHelpers');
const GroupEmotionRecord = require('../Classes/GroupEmotionRecord');

const question = (ctx) => {
  const messageInfo = ctx.reply('Reply with an emoji that best suits how you feel today!', {
    parse_mode: 'html',
    reply_markup: Markup.inlineKeyboard([
      [Markup.callbackButton('😖 - Stressed', '😖')],
      [Markup.callbackButton('🤬 - Frustrated', '🤬')],
      [Markup.callbackButton('😢 - Sad', '😢')],
      [Markup.callbackButton('😴 - Tired', '😴')],
      [Markup.callbackButton('😊 - Happy', '😊')],
    ]),
  });
  ctx.scene.state.messageInfo = messageInfo;
  ctx.wizard.next();
};

// step 2
const handleAnswer = new Composer();
handleAnswer.on('callback_query', async (ctx) => {
  // Process the reply from first question
  const query = ctx.callbackQuery;
  const grpEmoRec = new GroupEmotionRecord(
    ctx.scene.state.chatId,
    query.from.id,
    query.data,
  );
  try {
    await grpEmoRec.save();
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

const recordGroupEmotjournal = new WizardScene(
  'recordGroupEmotjournal',
  question,
  handleAnswer,
);
module.exports = recordGroupEmotjournal;
