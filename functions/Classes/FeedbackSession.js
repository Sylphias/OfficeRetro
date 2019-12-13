const { firestore } = require("../firebase");
const Moment = require("moment");
class FeedbackSession {
  constructor(userId, username, name, title, dateCreated, dateModified) {
    this.data = {
      userId,
      username,
      name,
      title,
      dateCreated: dateCreated ? dateCreated : Moment().valueOf(),
      dateModified: dateModified ? dateModified : Moment().valueOf()
    };
  }

  async save() {
    return await firestore.collection("feedback_session").add(this.data);
  }
}

module.exports = FeedbackSession;
