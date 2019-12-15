const Moment = require('moment');
const { firestore } = require('../firebase');

class GroupSubscription {
  constructor(chatId, chatTitle = '') {
    this.chatId = chatId;
    this.chatTitle = chatTitle;
  }

  static async get(chatId) {
    const query = await firestore.collection('group_subscriptions')
      .doc(chatId)
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
      .doc(this.chatId)
      .delete();
  }

  async getCurrentDayTeamEmotion() {
    const query = await firestore
      .collection('emotion_record')
      .where(
        'createdAt',
        '>',
        Moment()
          .subtract(1, 'days')
          .valueOf(),
      )
      .get();
    const emotionInString = query.docs
      .filter((doc) => this.chatId === doc.data().chatId)
      .reduce((accumulator, doc) => accumulator + doc.data().emotion, '');
    return emotionInString;
  }
}

module.exports = GroupSubscription;
