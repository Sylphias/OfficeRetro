const Firebase = require('../firebase');
const Moment = require('moment')
// this class manages all user related options

// TODO, user perms, etc
class User{
  constructor(userInfo){
    this.userId = userInfo.id? userInfo.id : userInfo.userId
    this.username = userInfo.username
    this.first_name = userInfo.first_name
    this.last_name = userInfo.last_name
  }

  async exists(){
    // check if user subscription already exists
    const query = await Firebase.collection('subscriptions').where('userId','==',this.userId).get()
    // There should be only 1 entry. Else delete one of the entries
    if(query.size>1){await this.unsubscribe()}
    return query.size === 0
  }
  async subscribe(){
    return await Firebase.collection('subscriptions').add({
      userId:this.userId,
      username:this.username,
      first_name:this.first_name,
      last_name : this.last_name
    })
  }

  async unsubscribe(){
    let querySnapshot = await Firebase.collection('subscriptions').where('userId','==',this.userId).get()
    await Firebase.collection('subscriptions').doc(querySnapshot.docs[0].id).delete()

  }

}

module.exports = User;
