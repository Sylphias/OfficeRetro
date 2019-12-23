const Moment = require('moment');
const { firestore } = require('../firebase');

class Question {
  constructor(text, type, options) {
    this.text = text;
    this.type = type;
    this.createdAt = Moment().valueOf();
  }
}
