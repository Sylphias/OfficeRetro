const Moment = require('moment');
const { firestore } = require('../firebase');

const collectionName = 'group_emotion_snapshot';

class GroupEmotionSnapshot {
  constructor(chatId, teamEmotionRecords, createdAt) {
    this.uuid = '';
    this.chatId = chatId;
    this.teamEmotionRecords = teamEmotionRecords;
    this.createdAt = createdAt || Moment().valueOf();
  }

  // TODO : retrieve Snapshots
  static async getLatestNSnapshot(numberOfSnapshots) {
    const docRef = await firestore.collection(collectionName).doc(this.getDocId()).get();
    this.teamEmotionRecords = docRef.data().teamEmotionRecords;
    this.createdAt = docRef.data().createdAt;
    this.modifiedAt = docRef.data().modifiedAt;
  }

  static async deleteSnapshot() {
    await firestore.collection(collectionName)
      .doc(this.getDocId()).delete();
  }

  async save() {
    await firestore.collection(collectionName).add({
      chatId: this.chatId,
      teamEmotionRecords: this.teamEmotionRecords,
      createdAt: this.createdAt,
      modifiedAt: Moment().valueOf(),
    });
  }
}

module.exports = GroupEmotionSnapshot;
