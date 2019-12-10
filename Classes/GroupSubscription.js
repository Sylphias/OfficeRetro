const Firebase = require('../firebase');
const Moment = require('moment')

class GroupSubscription{
  constructor(chatId,subscribedUsers = [], uuid=''){
    this.uuid = uuid
    this.chatId = chatId
    this.subscribedUsers = subscribedUsers
  }
  async exists(){
    const query = await Firebase.collection('group_subscriptions').where('chatId','==',this.chatId).get()
    // There should be only 1 entry. Else delete one of the entries
    if(query.size>1){await this.delete()}

    if(query.size === 0){return false}
    else{
      const data = query.docs[0].data();
      this.uuid = query.docs[0].id;
      this.chatId = data.chatId;
      this.subscribedUsers = data.subscribedUsers;
      return true
    }
  }

  async create(){
    if(!await this.exists()){
      const doc = await Firebase.collection('group_subscriptions').add({chatId: this.chatId.toString(),subscribedUsers : this.subscribedUsers})
      this.uuid = doc.id
    }
  }

  async update(){
    if(!this.uuid){throw new Error('Unable to update subscription, some information is missing from the records')}
    await Firebase.collection('group_subscriptions').doc(this.uuid).update({chatId:this.chatId.toString(),subscribedUsers:this.subscribedUsers})
  }

  async delete(){
    const query = await Firebase.collection('group_subscriptions').where('chatId','==',this.chatId.toString()).get()
    await Firebase.collection('group_subscriptions').doc(query.docs[0].data.id).delete()
  }

  async subscribeUser(userId){
    if(!this.uuid){throw new Error('Unable to update subscription, some information is missing from the records')}
    if (this.subscribedUsers.includes(userId)){throw new Error('User is already suscribed')}
    this.subscribedUsers.push(userId)
    await this.update()
  }

  async getCurrentDayTeamEmotion(){
    const query = await Firebase.collection('emotion_record').where('createdAt', '>', Moment().subtract(1,'days').valueOf()).get()
    const emotionInString = query.docs.filter((doc)=>this.subscribedUsers.includes(doc.data().userId))
    .reduce((accumulator,doc)=>{
      return accumulator+doc.data().emotion},'')
    return emotionInString
  }

  static async FetchGroupSubscription(chatId){
    const grp = new GroupSubscription(chatId)
    if(await grp.exists()){
      return grp
    }
  }

}

module.exports=GroupSubscription
