const cron = require('node-cron');
const sendUpdateReminders = require('../jobs/sendUpdateReminders.job');

cron.schedule('* * * * *', async () => {
  console.log('[CRON] התחלת שליחת תזכורות לעדכונים של מחר');
  await sendUpdateReminders();
});