require('dotenv').config()
const Markup = require("telegraf/markup");



const isSameChat= (ctx)=>{
  if(ctx.chat.id !== ctx.message.from.id){
      // user is not in a private chat
      ctx.reply('Please subscribe to me in a private chat window',{
      reply_markup: Markup.inlineKeyboard([[
        Markup.urlButton('Click here to open a private chat',`${process.env.BOT_URL}`),
      ]])
    })
    return false;
  }
  else {return true;}
}
module.exports={isSameChat}
