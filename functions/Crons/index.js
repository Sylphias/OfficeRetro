const UserCron = require('./user');
const GroupCron = require('./groups');

module.exports = { ...UserCron, ...GroupCron };
