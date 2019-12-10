const Firebase = require('../firebase');
const Moment = require('moment')
// this class manages all user related options

// TODO, user perms, etc
class User{
  constructor(userInfo){
    this.uuid = ''
    this.userId = userInfo.id? userInfo.id.toString() : userInfo.userId.toString()
    this.username = userInfo.username
    this.first_name = userInfo.first_name
    this.last_name = userInfo.last_name
  }

  async exists(){
    // check if user subscription already exists
    const query = await Firebase.collection('user_subscriptions').where('userId','==',this.userId.toString()).get()
    // There should be only 1 entry. Else delete one of the entries
    if(query.size>1){await this.unsubscribe()}
    if(query.size===0){return false}
    //populate the values of this object
    const data = query.docs[0].data();
    this.uuid= query.docs[0].id;
    this.userId = data.userId;
    this.username = data.username
    this.first_name = data.first_name
    this.last_name = data.last_name
    return true
  }

  async create(){
    if(!await this.exists()){
      return await Firebase.collection('user_subscriptions').add({
        userId:this.userId.toString(),
        username:this.username,
        first_name:this.first_name,
        last_name : this.last_name
      })
    }
  }

  async delete(){
    let querySnapshot = await Firebase.collection('user_subscriptions').where('userId','==',this.userId.toString()).get()
    await Firebase.collection('user_subscriptions').doc(querySnapshot.docs[0].id).delete()
  }

  static async fetchUser(userId){
    const user = new User({userId})
    if(await user.exists()){
      return user
    }
  }
}

module.exports = User;
