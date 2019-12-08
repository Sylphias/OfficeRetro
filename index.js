require('dotenv').config()

const Telegraf = require('telegraf');
const session = require('telegraf/session') 
const Stage = require('telegraf/stage');
const { leave } = Stage;

const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Stage();
const StartFeedbackSession = require('./Wizards/FeedbackSessionWizard');
const FeedbackEntry= require('./Wizards/FeedbackEntryWizard');


bot.use(session());
bot.use(stage.middleware());
stage.command('cancel', leave());
stage.register(StartFeedbackSession);
stage.register(FeedbackEntry);

bot.on('inline_query', async ({inlineQuery, answerInlineQuery})=>{
  try{
    return answerInlineQuery([],{switch_pm_text: 'Send Feedback Privately',switch_pm_parameter:inlineQuery.query})
  }catch(error){
    console.log(error);
  }
})

bot.command('startSession',(ctx)=>{
  ctx.scene.enter('feedbackStart');
})

bot.start((ctx) => {
  let args = ctx.message.text.split(' ')
  if(args.length<2){
    ctx.reply(`Hello there! This is Retro bot! Here are the commands you can use to start collecting feedback\n
    /startSession - starts a new feedback session
    /start <feedback-id> - starts a feedback entry for a particular session
    `)
  }else{
    ctx.scene.enter('feedbackEntry')
  }
});


bot.launch()
