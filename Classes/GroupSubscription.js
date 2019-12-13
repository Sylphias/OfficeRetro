const Moment = require('moment');
const Firebase = require('../firebase');

class GroupSubscription {
  constructor(chatId, chatTitle) {
    this.chatId = chatId;
    this.chatTitle = chatTitle;
  }

  static async get(chatId) {
    const query = await Firebase.collection('group_subscriptions')
      .doc(chatId)
      .get();
    const data = query.data();
    return data ? new GroupSubscription(data.chatId, data.subscribedUsers) : undefined;
  }

  async create() {
    await Firebase.collection('group_subscriptions').doc(this.chatId.toString()).set({
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
    await Firebase.collection('group_subscriptions')
      .doc(this.chatId)
      .delete();
  }

  async getCurrentDayTeamEmotion() {
    const query = await Firebase.collection('group_emotion_record')
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
