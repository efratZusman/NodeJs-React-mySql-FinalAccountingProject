const cron = require('node-cron');
const sendUpdateReminders = require('./sendUpdateReminders.job');

// ירוץ כל יום ב-8 בבוקר
cron.schedule('* * * * *', async () => {
  console.log('[CRON] התחלת שליחת תזכורות לעדכונים של מחר');
  await sendUpdateReminders();
});