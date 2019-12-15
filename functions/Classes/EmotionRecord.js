const Moment = require('moment');
const { firestore } = require('../firebase');

class EmotionRecord {
  constructor(userId, emotion) {
    this.userId = userId;
    this.emotion = emotion;
    this.createdAt = Moment().valueOf();
  }

  async save() {
    await firestore.collection('emotion_record').add({
      userId: this.userId,
      emotion: this.emotion,
      createdAt: this.createdAt,
    });
  }
}

module.exports = EmotionRecord;
