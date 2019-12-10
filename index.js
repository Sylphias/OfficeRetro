require('dotenv').config()

const Telegraf = require('telegraf');
const session = require('telegraf/session') 
const Stage = require('telegraf/stage');
const Markup = require('telegraf/markup');
const Cron = require('./crons');
const { leave } = Stage;

const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Stage();
const FeedbackEntry= require('./Wizards/FeedbackEntryWizard');
const EmotjournalWizard = require('./Wizards/EmotjournalWizard');

const CmdHelpers = require('./Helpers/CommandHelpers');
const removeIndent = require('./Helpers/TextHelpers').removeIndent;

const FeedbackSession = require('./Classes/FeedbackSession')
const User = require('./Classes/User')

bot.use(session());
bot.use(stage.middleware());
stage.command('cancel', leave());
stage.register(FeedbackEntry);
stage.register(EmotjournalWizard)


bot.action('update_emotjournal', async (ctx)=>{
  ctx.scene.enter('recordEmotjournal')
})

bot.command('subscribe', async (ctx)=>{
  // check if its a private chat
  if(!CmdHelpers.isSameChat(ctx)){return}
  // if in private chat, add user to firestore.
  const user = new User(ctx.message.from)
  try{
    await user.subscribe()
    ctx.reply('You have been subscribed to the Emotjournal!')

  }catch(err){
    ctx.reply('Sorry, there was an issue updating your Subscription. Please try again!')
  }
})

bot.command('unsubscribe', async(ctx)=>{
  if(!CmdHelpers.isSameChat(ctx)){return}
  const user = new User(ctx.message.from)
  try{
    await user.unsubscribe()
    ctx.reply('You have been unsubscribed from the Emotjournal!')

  }catch(err){
    ctx.reply('Sorry, there was an issue updating your Subscription. Please try again!')
  }
})

bot.command('startTeamEmotjournal', async (ctx)=>{
  ctx.reply('Please click on the button below to submit your feedback! Once you are in a private chat with the bot, click start to begin!', {
    reply_markup: Markup.inlineKeyboard([[
      Markup.urlButton('Register to Team',`${process.env.BOT_URL}?start=emotJournal`),
    ]]),
  });
})

bot.command('createSession', async (ctx)=>{

})

bot.command('startSession',async (ctx)=>{
  //get title  
  const matches = ctx.message.text.match(/[^ ]* (.*)/)
  if(!matches){ 
    return ctx.reply(`Input error: You should start a session like so -> /startSession <Session Title> - starts a new feedback session (eg /startSession Sprint retro 29th aug)`)
  }
  const msgInfo = ctx.message.from
  const feedbackSesh = new FeedbackSession(msgInfo.id,msgInfo.username,msgInfo.first_name,matches[1]);
  const doc = await feedbackSesh.save();
  ctx.reply('Please click on the button below to submit your feedback! Once you are in a private chat with the bot, click start to begin!', {
    reply_markup: Markup.inlineKeyboard([[
      Markup.urlButton('Give Feedback',`${process.env.BOT_URL}?start=${doc.id.toString()}`),
    ]]),
  });
})


const handleSingleArg = async (arg,ctx)=>{
  switch(arg){
    case 'emotJournal':
      // check if its a private chat
      if(!CmdHelpers.isSameChat(ctx)){return}
      // if in private chat, add user to firestore.
      const user = new User(ctx.message.from)
      try{
        await user.subscribe()
        ctx.reply('You have been subscribed to the Emotjournal!')
      }catch(err){
        ctx.reply('Sorry, there was an issue updating your Subscription. Please try again!')
      }
    break;
    default:
  }
}

bot.start((ctx) => {
  const welcomeMsg = removeIndent`
  Hello there! This is Retro bot! Here are the commands you can use to start collecting feedback\n
  --------
  /startSession <Session Title> - starts a new feedback session with a default questionnaire (eg /startSession Sprint retro 29th aug)
  /start <feedback-id> - starts a feedback entry for a particular session
  `
  let args = ctx.message.text.split(' ')
  if(args.length === 1){
    return ctx.reply(welcomeMsg)
  } 
  let subArgs = args[1].split('_')
  switch(subArgs.length){
    case 2:
      ctx.scene.enter('feedbackEntry')
      break;
    case 1:
      handleSingleArg(subArgs[0],ctx)
      break;
    default:
      ctx.reply(welcomeMsg)
  }
});

Cron.DeclareCronJobs(bot)
bot.launch()
