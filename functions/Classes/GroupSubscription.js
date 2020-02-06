const Moment = require('moment');
const { firestore } = require('../firebase');

class GroupSubscription {
  constructor(chatId, chatTitle = '') {
    this.chatId = chatId;
    this.chatTitle = chatTitle;
  }

  static async get(chatId) {
    const query = await firestore.collection('group_subscriptions')
      .doc(chatId.toString())
      .get();
    const data = query.data();
    return data ? new GroupSubscription(data.chatId, data.chatTitle) : undefined;
  }

  async create() {
    return firestore.collection('group_subscriptions')
      .doc(this.chatId.toString())
      .set({
        chatId: this.chatId.toString(),
        chatTitle: this.chatTitle,
      });
  }

  async delete() {
    if (!this.chatId) {
      throw new Error(
        'Unable to update subscription, some information is missing from the records',
      );
    }
    return firestore
      .collection('group_subscriptions')
      .doc(this.chatId.toString())
      .delete();
  }

  // This method retrieves all emotions of people who have submitted for that particular group in the last day.
  async getCurrentDayTeamEmotion(days) {
    const query = await firestore
      .collection('group_emotion_record')
      .where(
        'createdAt',
        '>',
        Moment()
          .subtract(days, 'days')
          .valueOf(),
      )
      .get();
    const teamEmotionRecords = query.docs
      .filter((doc) => this.chatId === doc.data().chatId)
      .map((doc) => ({ userId: doc.data().userId, emotion: doc.data().emotion }));
    return teamEmotionRecords;
  }
}


module.exports = GroupSubscription;
