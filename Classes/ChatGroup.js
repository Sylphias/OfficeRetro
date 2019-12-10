const Firebase = require('../firebase');
const Moment = require('moment')

class ChatGroup{
  constructor(ctx){
    this.uuid = ''
    this.chatId = ctx.chatId
    this.users = []
  }
  // what we can do is to have a fetch function that populates the values, then if uuid is not filled dont allow delete/update
  async create(){
    const doc = await Firebase.collection('chat_groups').add({chatId: this.chatId,users : this.users})
    this.uuid = doc.id
  }
  async update(){
    const query = await Firebase.collection('chat_groups').where('chatId','==',this.chatId).get()
    await Firebase.collection('chat_groups').doc(query.docs[0].data.id).update({chatId:chatId,users:this.users})
  }
  async delete(){
    const query = await Firebase.collection('chat_groups').where('chatId','==',this.chatId).get()
    await Firebase.collection('chat_groups').doc(query.docs[0].data.id).delete()
  }

}

module.exports=ChatGroup
