const Firebase = require("../firebase");
// this class manages all user related options

// TODO, user perms, etc
class User {
  constructor(userInfo) {
    this.userId = userInfo.id
      ? userInfo.id.toString()
      : userInfo.userId.toString();
    this.username = userInfo.username;
    this.first_name = userInfo.first_name || "";
    this.last_name = userInfo.last_name || "";
  }

  async exists() {
    // check if user subscription already exists
    const userDoc = await Firebase.collection("user_subscriptions")
      .doc(this.userId)
      .get();
    return userDoc.exists;
  }

  async create() {
    return await Firebase.collection("user_subscriptions")
      .doc(this.userId)
      .set({
        userId: this.userId,
        username: this.username,
        first_name: this.first_name,
        last_name: this.last_name
      });
  }

  async delete() {
    return await Firebase.collection("user_subscriptions")
      .doc(this.userId)
      .delete();
  }

  static async fetchUser(userId) {
    let userDoc = await Firebase.collection("user_subscriptions")
      .doc(userId)
      .get();
    return userDoc ? userDoc.data() : null;
  }
}

module.exports = User;
