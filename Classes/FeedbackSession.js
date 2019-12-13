const Moment = require('moment');
const Firebase = require('../firebase');

class FeedbackSession {
  constructor(userId, username, name, title, dateCreated, dateModified) {
    this.data = {
      userId,
      username,
      name,
      title,
      dateCreated: dateCreated || Moment().valueOf(),
      dateModified: dateModified || Moment().valueOf(),
    };
  }

  async save() {
    return Firebase.collection('feedback_session').add(this.data);
  }
}

module.exports = FeedbackSession;
