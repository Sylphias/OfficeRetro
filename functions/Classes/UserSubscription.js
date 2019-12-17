const { firestore } = require('../firebase');
// this class manages all user related options

// TODO, user perms, etc
class UserSubscription {
  constructor(userInfo) {
    this.userId = userInfo.id
      ? userInfo.id.toString()
      : userInfo.userId.toString();
    this.username = userInfo.username;
    this.first_name = userInfo.first_name || '';
    this.last_name = userInfo.last_name || '';
  }

  static async get(userId) {
    // check if user subscription already exists
    const userDoc = await firestore.collection('user_subscriptions')
      .doc(userId.toString())
      .get();
    return userDoc.data() ? new UserSubscription(userDoc.data()) : undefined;
  }

  async create() {
    return firestore
      .collection('user_subscriptions')
      .doc(this.userId)
      .set({
        userId: this.userId,
        username: this.username,
        first_name: this.first_name,
        last_name: this.last_name,
      });
  }

  async delete() {
    return firestore.collection('user_subscriptions')
      .doc(this.userId)
      .delete();
  }
}

module.exports = UserSubscription;
