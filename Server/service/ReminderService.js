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

// שליחת תזכורת למשתמש עבור עדכון
exports.sendReminder = async function sendReminder(user, update) {
    try {
        // כאן תשלבי שליחת מייל או וואטסאפ אמיתית
        console.log(`📬 שולחת תזכורת ל-${user.full_name} (${user.email})`);
        console.log(`🗓️ ${update.date} - ${update.title}`);
        console.log(update.content);
        // דוגמה: await emailService.send(user.email, update.title, update.content);
    } catch (error) {
        console.error('Error sending reminder:', error.message);
        throw new Error('Reminder sending failed');
    }
};
