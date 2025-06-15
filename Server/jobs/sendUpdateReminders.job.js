const reminderService= require('../service/ReminderService');

async function sendUpdateReminders() {
  const updates = await reminderService.getTomorrowUpdates();
  if (updates.length === 0) {
    console.log('[CRON] אין עדכונים למחר');
    return;
  }

  const globalSubscribers = await reminderService.getGlobalSubscribers();

  for (const update of updates) {
    const directSubscribers = await reminderService.getSubscribersForUpdate(update.id);

    const allUsers = new Map();

    for (const user of directSubscribers) {
      allUsers.set(user.user_id, user);
    }

    for (const user of globalSubscribers) {
      allUsers.set(user.user_id, user); // לא תתווסף כפילות
    }

    for (const user of allUsers.values()) {
      await reminderService.sendReminder(user, update);
    }
  }

  console.log(`[CRON] נשלחו תזכורות ל-${updates.length} עדכונים`);
}

module.exports = sendUpdateReminders;
