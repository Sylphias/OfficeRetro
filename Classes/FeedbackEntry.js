const Moment = require('moment');
const Firebase = require('../firebase');

class FeedbackEntry {
  constructor(userId, username, sessionId, dateCreated, dateModified) {
    this.data = {
      userId,
      username,
      sessionId,
      responses: [],
      dateCreated: dateCreated || Moment().valueOf(),
      dateModified: dateModified || Moment().valueOf(),
    };
  }

  addResponse(question, answer) {
    this.data.responses.push({ question, answer });
  }

  async save() {
    return Firebase.collection('feedback_entries').add(this.data);
  }

  resetResponses() {
    this.data.responses = [];
  }
}

module.exports = FeedbackEntry;
