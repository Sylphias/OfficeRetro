const Moment = require('moment');
const Firebase = require('../firebase');

class GroupEmotionRecord {
  constructor(chatId, userId, emotion, createdAt, modifiedAt) {
    this.uuid = '';
    this.chatId = chatId;
    this.userId = userId;
    this.emotion = emotion;
    this.createdAt = createdAt || Moment().valueOf();
    this.modifiedAt = modifiedAt || Moment().valueOf();
  }

  // Check if person has sent an emotion record in the past day for the group already
  async exists() {
    if (!this.chatId || !this.userId) { throw new Error('Insufficient Record Information'); }
    // Retrieves all records within the last day, then filter based on userId and chatId
    const queryRef = await Firebase.collection('group_emotion_record')
      .where('createdAt', '>=', Moment().subtract(1, 'days').valueOf());

    const emoRecord = queryRef.docs
      .filter((doc) => doc.data().userId === this.userId && doc.data().chatId === this.chatId);

    this.emotion = emoRecord.data().emotion;
    this.createdAt = emoRecord.data().createdAt;
    this.modifiedAt = emoRecord.data().modifiedAt;

    return !!emoRecord[0].data();
  }

  async delete() {
    if (!this.uuid && !this.exists()) {
      throw new Error('This record does not exist');
    }
    await Firebase.collection('group_emotion_record')
      .doc(this.uuid).delete();
    return true;
  }

  async create() {
    await Firebase.collection('group_emotion_record').add({
      chatId: this.chatId,
      userId: this.userId,
      emotion: this.emotion,
      createdAt: this.createdAt,
    });
  }
}
