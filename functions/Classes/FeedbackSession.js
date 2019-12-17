const Moment = require('moment');
const { firestore } = require('../firebase');
const { removeIndent } = require('../Helpers/TextHelpers');

const collectionName = 'feedback_session';
const summarizeFeedbackEntry = (entry) => entry.responses.reduce((accumulator, response, index) => `${accumulator} ${index + 1}) ${response.answer}\n`, '');
class FeedbackSession {
  constructor(data) {
    this.uuid = data.uuid;
    this.userId = data.userId;
    this.username = data.username;
    this.name = data.name;
    this.title = data.title;
    this.questions = [
      { title: 'How do you feel about this week\'s work' },
      { title: 'If there was one thing that can be done better this week, what would it be?' },
      { title: 'Why so? (Provide more context and information)' },
    ];// for now the questions are fixed
    this.dateCreated = data.dateCreated ? data.dateCreated : Moment().valueOf();
    this.dateModified = data.dateModified ? data.dateCreated : Moment().valueOf();
  }

  async create() {
    const docRef = await firestore.collection(collectionName).add(
      {
        userId: this.userId,
        username: this.username,
        name: this.name,
        title: this.title,
        createdAt: Moment().valueOf(),
        modifiedAt: Moment().valueOf(),
      },
    );
    const snapshot = await docRef.get();
    this.uuid = snapshot.id;
    return true;
  }

  async get() {
    if (!this.uuid) { throw new Error('Session id not provided, unable to find session'); }
    const docRef = await firestore.collection(collectionName).doc(this.uuid).get();
    if (!docRef.data()) { throw new Error('Feedback session not found'); }
    const values = { ...docRef.data() };
    this.name = values.name;
    this.title = values.title;
    this.username = values.username;
    this.createdAt = values.createdAt;
    this.modifiedAt = values.modifiedAt;
    return true;
  }


  async showSessionResponses() {
    if (!this.uuid) { throw new Error('Session id not provided, unable to find session'); }
    const querySnap = await firestore.collection('feedback_entries').where('sessionId', '==', this.uuid).get();
    const questions = this.questions.reduce((accumulator, qns, index) => `${accumulator} ${index + 1}) ${qns.title}\n`, '');


    const responses = querySnap.docs.length > 0
      ? querySnap.docs.reduce((accumulator, doc) => `${accumulator} ${summarizeFeedbackEntry(doc.data())}\n\n`, '<b>Here are the responeses so far:</b> \n\n')
      : 'Sorry There are no responses for this session yet!';
    const message = removeIndent`This Feedback was created by ${this.name} with the following context:
    <b>${this.title}</b>
    ---------------
    These are the questions:
    ${questions}
    ---------------
    ${responses}
    `;
    return message;
  }
}

module.exports = FeedbackSession;
