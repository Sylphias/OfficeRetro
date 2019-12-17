const { CronJob } = require('cron');
const { dailyGroupEmotionMessage, groupRecordEmotion } = require('../functions/Crons');


const DeclareGroupCronJobs = () => {
// 0 15 9 * * 1-5
  const GroupDailyEmotionMessage = new CronJob(
    '*/10 * * * * 1-5',
    dailyGroupEmotionMessage,
    null,
    true,
    'Asia/Singapore',
  );

  const GroupRecordEmotion = new CronJob(
    '*/10 * * * * 1-5',
    groupRecordEmotion,
    null,
    true,
    'Asia/Singapore',
  );
};

module.exports = DeclareGroupCronJobs;
