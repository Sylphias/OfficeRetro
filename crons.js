const CronJob = require('cron').CronJob;
const Telegram = require('telegraf/telegram');
const Markup = require('telegraf/markup');

const bot = new Telegram(process.env.BOT_TOKEN)
const SubscriptionHelper = require('./Helpers/SubscriptionHelpers');
const removeIndent = require('./Helpers/TextHelpers').removeIndent;
const User = require('./Classes/UserSubscription');
const GroupSubscription = require('./Classes/GroupSubscription');

const DeclareCronJobs = ()=>{
  //0 15 17 * * 1-5
  new CronJob('0 15 17 * * 1-5',
  async ()=>{
   const userDocs = await SubscriptionHelper.GetActiveSubscriptionsUserId()
   userDocs.map(async (doc)=>{
      const user = new User(doc.data());
      try{
        await bot.sendMessage(user.userId,
           `Hello there ${user.first_name}! Would you like record how you are feeling today?`,
           {
            reply_markup: {
              inline_keyboard: [[
                Markup.callbackButton('Yes!','update_emotjournal'),
              ]],
            }
           }
          
        )
      }catch(err){
        console.error('User has not allowed the bot to converse with him/her, removing user from subscription')
        try{
          if(err.code === 403){
            await user.unsubscribe()
            console.log('Successfully removed subscription')
          }
        }catch(err){
          console.log('Error while trying to update subscription status')
          console.error(err)
        }
      }
    })
  },
  null,
  true,
  'Asia/Singapore'
  )
  //0 15 9 * * 1-5
  new CronJob('*/10 * * * * 1-5',
  async ()=>{
   const groupQueryDocs = await SubscriptionHelper.GetActiveGroupSubscriptions()
   groupQueryDocs.map(async (queryDoc)=>{
      try{
        const groupInfo = queryDoc.data()
        const group = new GroupSubscription(groupInfo.chatId,groupInfo.subscribedUsers,groupInfo.uuid)
        const emotions = await group.getCurrentDayTeamEmotion()
        const message = emotions.length === 0 ? `Sorry, nobody filled up their emotion journals today... ` :  
        removeIndent`This is a summary of how your team felt after yesterday:

        ${emotions}
        `
        await bot.sendMessage(groupInfo.chatId,
          message
        )
      }catch(err){
        bot.sendMessage('Failed to retrieve team\'s emotional summary for today.')
        console.error(err)
      }
    })
  },
  null,
  true,
  'Asia/Singapore'
  )
}

module.exports = {DeclareCronJobs}
