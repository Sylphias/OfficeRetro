const Firebase = require("../firebase");
const Moment = require("moment");

class GroupSubscription {
  constructor(chatId, subscribedUsers = [], uuid = "") {
    this.chatId = chatId;
    this.subscribedUsers = subscribedUsers;
  }

  static async get(chatId) {
    const query = await Firebase.collection("group_subscriptions")
    .doc(chatId)  
    .get();
    const data = query.data()
    return data? new GroupSubscription(data.chatId,data.subscribedUsers): undefined;
  }

  async create() {
    await Firebase.collection("group_subscriptions").doc(this.chatId.toString()).set({
      chatId: this.chatId.toString(),
      subscribedUsers: this.subscribedUsers
    });
  }

  async update() {
    if (!this.chatId) {
      throw new Error(
        "Unable to update subscription, some info`rmation is missing from the records"
      );
    }
    await Firebase.collection("group_subscriptions")
      .doc(this.chatId)
      .update({
        chatId: this.chatId.toString(),
        subscribedUsers: this.subscribedUsers
      });
  }

  async delete() {
    if (!this.chatId) {
      throw new Error(
        "Unable to update subscription, some information is missing from the records"
      );
    }
    await Firebase.collection("group_subscriptions")
      .doc(this.chatId)
      .delete();
  }

  async subscribeUser(userId) {
    if (this.subscribedUsers.includes(userId)) {
      throw new Error("User is already suscribed");
    }
    this.subscribedUsers.push(userId);
    await this.update();
  }

  async getCurrentDayTeamEmotion() {
    const query = await Firebase.collection("emotion_record")
      .where(
        "createdAt",
        ">",
        Moment()
          .subtract(1, "days")
          .valueOf()
      )
      .get();
    const emotionInString = query.docs
      .filter(doc => this.subscribedUsers.includes(doc.data().userId))
      .reduce((accumulator, doc) => {
        return accumulator + doc.data().emotion;
      }, "");
    return emotionInString;
  }
}

module.exports = GroupSubscription;
