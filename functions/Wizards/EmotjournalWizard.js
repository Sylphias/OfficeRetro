const WizardScene = require('telegraf/scenes/wizard');
const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');

const EmotionRecord = require('../Classes/EmotionRecord');

const question = (ctx) => {
  console.log(ctx);
  ctx.reply('Reply with an emoji that best suits how you feel today!', {
    parse_mode: 'html',
    ...Markup.keyboard([
      ['😊', '😞', '😴'],
      ['🤬', '😢', '🤢'],
    ])
      .oneTime()
      .resize()
      .extra(),
  });
  ctx.wizard.next();
};

// step 2
const handleAnswer = new Composer();
handleAnswer.on('text', (ctx) => {
  // Process the reply from first question
  const emoRec = new EmotionRecord(ctx.message.from.id, ctx.message.text);
  emoRec.save();
  ctx.reply(
    'Thank you for sharing how you feel. A summary will be given to you at the end of the week!',
  );
  ctx.scene.leave();
});

const EmotjournalStart = new WizardScene(
  'recordEmotjournal',
  question,
  handleAnswer,
);
module.exports = EmotjournalStart;