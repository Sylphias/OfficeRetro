const Firebase = require('../firebase');
const Moment = require('moment')

const GetActiveSubscriptionsUserId = async ()=>{
  const subQueryRef = await Firebase.collection('subscriptions').get()
  return subQueryRef.docs
}

module.exports={GetActiveSubscriptionsUserId}
