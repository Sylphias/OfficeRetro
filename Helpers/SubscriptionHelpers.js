const Firebase = require('../firebase');
const Moment = require('moment')

const GetActiveSubscriptionsUserId = async ()=>{
  const subQueryRef = await Firebase.collection('user_subscriptions').get()
  return subQueryRef.docs
}

const GetActiveGroupSubscriptions = async ()=>{
  const subQueryRef = await Firebase.collection('group_subscriptions').get()
  return subQueryRef.docs
}

module.exports={
  GetActiveSubscriptionsUserId,
  GetActiveGroupSubscriptions
}
