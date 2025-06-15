const db = require('../../DB/connection');

// שליפת כל העדכונים שמתוכננים למחר
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

// שליפת כל המשתמשים שנרשמו לעדכון מסוים
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

// שליפת המשתמשים שרשומים לכלל העדכונים (wants_updates = true)
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
        const endTime = new Date(startTime.getTime() + 30 * 60000); // תוספת 30 דקות
        const location = update.location || 'Zoom / מיקום לא צויין';

        await emailService.sendCalendarInvite(
            user.email,
            subject,
            description,
            startTime,
            endTime,
            location
        );

        console.log(`📬 נשלחה תזכורת ל-${user.full_name} (${user.email})`);
    } catch (error) {
        console.error(`❌ שגיאה בשליחת תזכורת ל-${user.full_name}:`, error.message);
    }
};

