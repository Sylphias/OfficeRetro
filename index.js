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

const FeedbackSession = require('./Classes/FeedbackSession');
const UserSubscription = require('./Classes/UserSubscription');
const GroupSubscription = require('./Classes/GroupSubscription');

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
  const user = new UserSubscription(ctx.message.from)
  try{
    await user.create()
    ctx.reply('You have been subscribed to the Emotjournal!')
  }catch(err){
    ctx.reply('Sorry, there was an issue updating your Subscription. Please try again!')
  }
})

bot.command('unsubscribe', async(ctx)=>{
  if(!CmdHelpers.isSameChat(ctx)){return}
  const user = new UserSubscription(ctx.message.from)
  try{
    await user.delete()
    ctx.reply('You have been unsubscribed from the Emotjournal!')
  }catch(err){
    ctx.reply('Sorry, there was an issue updating your Subscription. Please try again!')
  }
})

bot.command('startTeamEmotionJournal', async (ctx)=>{
  //create a group chat object, if it already exists then return the groupchat
  const grpChat = new GroupSubscription(ctx.chat.id)
  try{
    await grpChat.create()
  }catch(err){
    return ctx.reply('Error Registering Group, please try again!')
  }
  ctx.reply(removeIndent`This team will now receive daily emotional roundups!
  To subscribe to a daily`, {
    reply_markup: Markup.inlineKeyboard([[  
      Markup.urlButton('Register to Team',`${process.env.BOT_URL}?start=emotionJournal_${grpChat.chatId.toString()}`),
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


const handleInputWithArgs = async (arg,ctx)=>{
  switch(arg[0]){
    case 'emotionJournal':
      // check if its a private chat
      if(!CmdHelpers.isSameChat(ctx)){return}
      // if in private chat, add user to firestore.
      try{
        //check if user is already recording emotion
        const user = new UserSubscription(ctx.message.from);
        await user.create();
        const grpSub = new GroupSubscription(arg[1])
        await grpSub.create()
        await grpSub.subscribeUser(ctx.message.from.id);
        ctx.reply('You have been subscribed to the Emotjournal!')
      }catch(err){
        ctx.reply(`Sorry, there was an issue updating your Subscription! (${err})`)
      }
    break;
    default:
  }
}
const welcomeMsg = removeIndent`
Hello there! This is Retro bot! Here are the commands you can use to start collecting feedback\n
----- Group Commands -----
/startSession <Session Title> - starts a new feedback session with a default questionnaire (eg /startSession Sprint retro 29th aug)
/start <feedback-id> - starts a feedback entry for a particular session
/startTeamEmotionJournal - Subscribe to daily team emotion monitoring

----- Private Commands (1-1 chat with bot) -----
/subscribe - be able to record a daily emotion journal
/unsubscribe - stop doing daily emotion journaling

`
bot.command('help',(ctx)=>{
  ctx.reply(welcomeMsg,{parse_mode:'html'})
})

bot.start((ctx) => {

  let args = ctx.message.text.split(' ')
  if(args.length === 1){
    return ctx.reply(welcomeMsg,{parse_mode:'html'})
  }
  let subArgs = args[1].split('_')
  switch(subArgs.length){
    case 2:
      handleInputWithArgs(subArgs,ctx)
      break;
    case 1:
      ctx.scene.enter('feedbackEntry')
      break;
    default:
      ctx.reply(welcomeMsg,{parse_mode:'html'})
  }
});

Cron.DeclareCronJobs(bot)
bot.launch()
