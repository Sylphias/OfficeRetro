const Firebase = require('../firebase');
const Moment = require('moment')
class EmotionRecord{
  constructor(userId,emotion){
    this.userId = userId
    this.emotion = emotion
    this.createdAt = Moment().valueOf()
  }

  async save(){
      await Firebase.collection('emotion_record').add({
      userId: this.userId,
      emotion: this.emotion,
      createdAt: this.createdAt
    })
  }
}

module.exports = EmotionRecord
