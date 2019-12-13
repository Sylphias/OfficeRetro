const { firestore } = require("../firebase");

const GetActiveSubscriptionsUserId = async () => {
  const subQueryRef = await firestore.collection("user_subscriptions").get();
  return subQueryRef.docs;
};

const GetActiveGroupSubscriptions = async () => {
  const subQueryRef = await firestore.collection("group_subscriptions").get();
  return subQueryRef.docs;
};

module.exports = {
  GetActiveSubscriptionsUserId,
  GetActiveGroupSubscriptions
};
