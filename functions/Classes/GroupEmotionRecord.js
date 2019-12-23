const Moment = require('moment');
const { firestore } = require('../firebase');

const collectionName = 'group_emotion_record';

class GroupEmotionRecord {
  constructor(chatId, userId, emotion, createdAt, modifiedAt) {
    this.uuid = '';
    this.chatId = chatId;
    this.userId = userId;
    this.emotion = emotion;
    this.createdAt = createdAt || Moment().valueOf();
  }

  async get() {
    if (!this.chatId || !this.userId) {
      throw new Error('Insufficient data to find record.');
    }
    const queryRef = await firestore.collection(collectionName).where('createdAt', '>=', Moment().subtract('1', 'days')).get();
    const filtered = queryRef.docs.filter(
      (doc) => doc.data().chatId === this.chatId && doc.data().userId === this.userId,
    );
    if (filtered.length !== 1) { throw new Error('Unable to find user record for this group'); }
    this.emotion = filtered[0].data().emotion;
    this.createdAt = filtered[0].data().createdAt;
    this.modifiedAt = filtered[0].data().modifiedAt;
    this.uuid = filtered[0].id;
  }

  async delete() {
    if (!this.uuid) { throw new Error('Unable to delete document : Id not found'); }
    await firestore.collection(collectionName)
      .doc(this.uuid).delete();
  }


  async save() {
    await firestore.collection(collectionName).add({
      chatId: this.chatId,
      userId: this.userId,
      emotion: this.emotion,
      createdAt: this.createdAt,
    });
  }
}

module.exports = GroupEmotionRecord;
