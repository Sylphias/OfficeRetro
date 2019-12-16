const { CronJob } = require('cron');
const { updateUserEmoteJournal } = require('../functions/Crons');

const DeclareUserCronJobs = () => {
  // 0 15 17 * * 1-5
  const userRecordEmotion = new CronJob(
    '0 15 17 * * 1-5',
    updateUserEmoteJournal,
    null,
    true,
    'Asia/Singapore',
  );
};

module.exports = DeclareUserCronJobs;
