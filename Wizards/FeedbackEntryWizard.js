const WizardScene = require('telegraf/scenes/wizard');
const RemoveIndent = require('../Helpers/TextHelpers').removeIndent;
const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');

const FeedbackEntry = require('../Classes/FeedbackEntry');

const cancel = (ctx)=>{
  ctx.reply(RemoveIndent`Cancelling Feedback, you can start again by clicking on the Give Feedback button!`)
  ctx.scene.leave()
}

const submit= async (ctx)=>{
  await ctx.scene.session.entry.save()
  ctx.reply(RemoveIndent`
    Thank you for sending in your feedback!
  `)
  ctx.scene.leave();
}

const question1 = (ctx) => {
  const args =ctx.message.text.split(' ')
  const info = ctx.message.from;
  const sessionId = args[1]
  // create the entry object
  const feedbackEntry = new FeedbackEntry(info.id, info.username, sessionId)
  ctx.scene.session.entry = feedbackEntry;
  ctx.reply(RemoveIndent`Hello There! Thank you for taking some time to fill in this feedback. 
  If at any time you wish to cancel, press the cancel button or type /cancel
  -------
  Question 1:
  How do you feel about this week's work in your team?
  `,{
    parse_mode:'html',
    ...Markup.keyboard([
      ['😊','😞'],
      ['🤬','😢']
    ]).oneTime().resize().extra()
  } 
);
 
  ctx.wizard.next();
}
//step 2
const question2 = new Composer();
question2.command('cancel',cancel)
question2.on('text', (ctx)=>{
  // Process the reply from first question
  const feedbackEntry = ctx.scene.session.entry
  feedbackEntry.addResponse('How do you feel about this week\'s work',ctx.message.text);
  ctx.reply(RemoveIndent`Question 2:
  If there was one thing that can be done better this week, what would it be?`,
  {
    reply_markup: {
      inline_keyboard: [[
        Markup.callbackButton('End Feedback','endFeedback'),
        Markup.callbackButton('Cancel','cancel')
      ]],
    }
  }
  )
  ctx.wizard.next();
});
const question3 = new Composer();


question3.action('endFeedback',submit)
question3.action('cancel',cancel)
question2.command('cancel',cancel)
question3.on('text',(ctx)=>{
  // Process the reply from first question
  const feedbackEntry = ctx.scene.session.entry
  feedbackEntry.addResponse('If there was one thing that can be done better this week, what would it be?',ctx.message.text);
  ctx.reply(RemoveIndent`Question 3:
  Why so? (Provide more context and information)`
  ,
  {
    reply_markup: {
      inline_keyboard: [[
        Markup.callbackButton('End Feedback','endFeedback'),
        Markup.callbackButton('Cancel','cancel')
      ]],
    }
  })
  ctx.wizard.next();
});


const endFeedbackEntry = new Composer()
endFeedbackEntry.action('endFeedback',submit)
endFeedbackEntry.action('cancel',cancel)
endFeedbackEntry.command('cancel',cancel)
endFeedbackEntry.on('text',async (ctx)=>{
  const feedbackEntry = ctx.scene.session.entry
  feedbackEntry.addResponse('Why so? (Provide more context and information)',ctx.message.text);
  await feedbackEntry.save()
  ctx.reply('Thank you for filling up this feedback!')
  ctx.scene.leave();
});

const StartFeedbackEntryWizard = new WizardScene('feedbackEntry',
question1, 
question2,
question3,
endFeedbackEntry
)
module.exports = StartFeedbackEntryWizard;
