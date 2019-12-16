const Moment = require('moment');
const { firestore } = require('../firebase');

const Moment = require('moment');
const { firestore } = require('../firebase');

const collectionName = 'group_emotion_record';

class GroupEmotionRecord {
  constructor(chatId, userId, teamEmotionRecords, createdAt, modifiedAt) {
    this.chatId = chatId;
    this.userId = userId;
    this.teamEmotionRecords = teamEmotionRecords;
    this.createdAt = createdAt || Moment().valueOf();
  }

  async get() {
    if (!this.chatId || !this.userId) {
      throw new Error('Insufficient data to find record.');
    }

    const docRef = await firestore.collection(collectionName).doc(this.getDocId()).get();
    this.emotion = docRef.data().emotion;
    this.createdAt = docRef.data().createdAt;
    this.modifiedAt = docRef.data().modifiedAt;
  }

  async delete() {
    await firestore.collection(collectionName)
      .doc(this.getDocId()).delete();
  }

  getDocId() {
    return `${this.chatId.toString()}_${this.userId.toString()}`;
  }

  async save() {
    await firestore.collection(collectionName).doc(this.getDocId()).set({
      chatId: this.chatId,
      userId: this.userId,
      emotion: this.emotion,
      createdAt: this.createdAt,
      modifiedAt: Moment().valueOf(),
    }, { merge: true });
  }
}

module.exports = GroupEmotionRecord;
