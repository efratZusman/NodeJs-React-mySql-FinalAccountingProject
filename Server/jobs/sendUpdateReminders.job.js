

const reminderService = require('../service/ReminderService');

async function sendUpdateReminders() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const overmorrow = new Date(today);
  overmorrow.setDate(today.getDate() + 2);

  const isTomorrowBlocked = await reminderService.isHolidayOrShabbat(tomorrow);
  const isTodayBlocked = await reminderService.isHolidayOrShabbat(today);

  let targetDate = tomorrow;

  if (isTomorrowBlocked && !isTodayBlocked) {
    targetDate = overmorrow ;
    console.log('[CRON] מחר חג/שבת → מקדים שליחת תזכורות להיום');
  } else if (!isTomorrowBlocked && !isTodayBlocked) {
    targetDate = tomorrow;
  } else {
    console.log('[CRON] היום חג/שבת → לא שולח תזכורות');
    return;
  }
  const updates = await reminderService.getTomorrowUpdates();
  if (targetDate == overmorrow) {
    const overMorrowupdates = await reminderService.getUpdatesByDate(targetDate);
    updates.push(...overMorrowupdates);
  }
  if (updates.length === 0) {
    console.log('[CRON] אין עדכונים ל-' + targetDate.toISOString().split('T')[0]);
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
      allUsers.set(user.user_id, user);
    }

    for (const user of allUsers.values()) {
      await reminderService.sendReminder(user, update);
    }
  }

  console.log(`[CRON] נשלחו תזכורות ל-${updates.length} עדכונים עבור ${targetDate.toISOString().split('T')[0]}`);
}

module.exports = sendUpdateReminders;
