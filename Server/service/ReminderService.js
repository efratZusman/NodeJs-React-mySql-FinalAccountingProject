const db = require('../../DB/connection');
const emailService = require('./EmailService');
const holidayCache = new Map();

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

async function isHoliday(date) {
    const dateStr = formatDate(date);
    if (holidayCache.has(dateStr)) return holidayCache.get(dateStr);

    try {
        const params = new URLSearchParams({
            v: 1,
            cfg: 'json',
            start: dateStr,
            end: dateStr,
            geo: 'il',
            maj: 'on',
            min: 'on',
            mod: 'on',
            nx: 'on',
            s: 'on'
        });
        const response = await fetch(`https://www.hebcal.com/hebcal?${params.toString()}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log('[ReminderService] בדיקת חג עבור תאריך:', dateStr, 'תוצאה:', data);
        const isHoliday = data.items?.some(item =>
            item.category === 'holiday' && item.subcat === 'major' || item.category === 'parashat'
        );

        holidayCache.set(dateStr, isHoliday);
        return isHoliday;
    } catch (err) {
        console.error('[ReminderService] שגיאה בבדיקת חג:', err);
        return false;
    }
}

async function isHolidayOrShabbat(date) {
    const isShabbat = date.getDay() === 6;
    return isShabbat || await isHoliday(date);
}

exports.getTomorrowUpdates = async function getTomorrowUpdates() {
    const query = `
        SELECT * FROM updates
        WHERE date = CURDATE() + INTERVAL 1 DAY
    `;
    try {
        const [rows] = await db.execute(query);
        return rows;
    } catch (error) {
        throw new Error('Error fetching tomorrow\'s updates: ' + error.message);
    }
};

exports.getSubscribersForUpdate = async function getSubscribersForUpdate(updateId) {
    const query = `
        SELECT u.user_id, u.full_name, u.email
        FROM users u
        JOIN update_subscriptions us ON u.user_id = us.user_id
        WHERE us.update_id = ?
    `;
    try {
        const [rows] = await db.execute(query, [updateId]);
        return rows;
    } catch (error) {
        throw new Error('Error fetching subscribers for update: ' + error.message);
    }
};

exports.getGlobalSubscribers = async function getGlobalSubscribers() {
    const query = `
        SELECT user_id, full_name, email
        FROM users
        WHERE wants_updates = TRUE
    `;
    try {
        const [rows] = await db.execute(query);
        return rows;
    } catch (error) {
        throw new Error('Error fetching global subscribers: ' + error.message);
    }
};

exports.sendReminder = async function sendReminder(user, update) {
    try {
        const subject = `📅 תזכורת לעדכון מחר: ${update.title}`;
        const description = `שלום ${user.full_name},\n\nתזכורת לעדכון שמתוכנן למחר:\n\n${update.title}\n${update.date}\n\n${update.content}`;
        const startTime = new Date(update.date);
        // const endTime = new Date(startTime.getTime() + 30 * 60000); // תוספת 30 דקות
        //  const location = update.location || 'Zoom / מיקום לא צויין';

        await emailService.sendCalendarInvite(
            user.email,
            subject,
            description,
            startTime
        );

        console.log(`📬 נשלחה תזכורת ל-${user.full_name} (${user.email})`);
    } catch (error) {
        console.error(`❌ שגיאה בשליחת תזכורת ל-${user.full_name}:`, error.message);
    }
};

exports.getUpdatesByDate = async function (date) {
    const dateStr = date.toISOString().split('T')[0];
    const query = `
      SELECT * FROM updates
      WHERE date = ?
  `;
    try {
        const [rows] = await db.execute(query, [dateStr]);
        return rows;
    } catch (error) {
        throw new Error('Error fetching updates: ' + error.message);
    }
};


module.exports.isHoliday = isHoliday;
module.exports.isHolidayOrShabbat = isHolidayOrShabbat;

