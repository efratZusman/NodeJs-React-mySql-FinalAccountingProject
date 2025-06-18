const cron = require('node-cron');
const sendUpdateReminders = require('../jobs/sendUpdateReminders.job');

cron.schedule('40 10 * * 0-5', async () => {
  console.log('[CRON] התחלת שליחת תזכורות לעדכונים של מחר');
  await sendUpdateReminders();
});



