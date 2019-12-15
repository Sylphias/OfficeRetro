const { firestore } = require("../firebase");
const Moment = require("moment");
class FeedbackEntry {
  constructor(userId, username, sessionId, dateCreated, dateModified) {
    this.data = {
      userId,
      username,
      sessionId,
      responses: [],
      dateCreated: dateCreated ? dateCreated : Moment().valueOf(),
      dateModified: dateModified ? dateModified : Moment().valueOf()
    };
  }

  addResponse(question, answer) {
    this.data.responses.push({ question, answer });
  }

  async save() {
    return await firestore.collection("feedback_entries").add(this.data);
  }

  resetResponses() {
    this.data.responses = [];
  }
}

module.exports = FeedbackEntry;
