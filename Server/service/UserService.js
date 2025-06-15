const db = require('../../DB/connection');
const { v4: uuidv4 } = require('uuid');

// Create a new user with password (using transaction)
exports.createUser = async function createUser(userData) {
    const { full_name, email, password_hash, wants_updates } = userData;

    const userQuery = 'INSERT INTO users (full_name, email, wants_updates) VALUES (?, ?, ?)';
    const userParams = [full_name, email, wants_updates];

    const passwordQuery = 'INSERT INTO passwords (user_id, password_hash) VALUES (?, ?)';

    try {
        const [userResult] = await db.execute(userQuery, userParams);
        const userId = userResult.insertId;
        await db.execute(passwordQuery, [userId, password_hash]);
        return userId;
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
};
// Get user by Username
exports.getUserByUsername = async function getUserByUsername(username) {
    const query = `
        SELECT Users.UserID, Users.Username, Users.Email, Users.CreatedAt, Passwords.PasswordHash 
        FROM Users 
        LEFT JOIN Passwords ON Users.UserID = Passwords.UserID 
        WHERE Users.Username = ?
    `;
    try {
        const [rows] = await db.execute(query, [username]);
        return rows[0];
    } catch (error) {
        throw new Error('Error fetching user: ' + error.message);
    }
};
// Get user by Username
exports.getUserByEmail = async function getUserByEmail(email) {
    const query = `
        SELECT *
        FROM Users 
        WHERE users.email = ?
    `;
    try {
        const [rows] = await db.execute(query, [email]);
        return rows[0];
    } catch (error) {
        throw new Error('Error fetching user: ' + error.message);
    }
};

// Get user by Username
exports.getUserDetails = async function getUserDetails(email) {
    const query = `
        SELECT users.user_id, users.full_name, users.email, passwords.password_hash 
        FROM users 
        LEFT JOIN passwords ON users.user_id = Passwords.user_id 
        WHERE users.email = ?
    `;
    try {
        const [rows] = await db.execute(query, [email]);
        return rows[0];
    } catch (error) {
        throw new Error('Error fetching user: ' + error.message);
    }
};

exports.getUserById = async function getUserById(user_id) {
    const query = `
        SELECT full_name, email, role, wants_updates
        FROM users 
        WHERE user_id = ?
    `;
    try {
        const [rows] = await db.execute(query, [user_id]);
        return rows[0];
    } catch (error) {
        throw new Error('Error fetching user: ' + error.message);
    }
};

// Create session
exports.createSession = async function createSession(userId) {
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // שעה קדימה
    await db.execute(
        'INSERT INTO sessions (session_id, user_id, expires_at) VALUES (?, ?, ?)',
        [sessionId, userId, expiresAt]
    );
    return sessionId;
};

exports.deleteSession = async function deleteSession(sessionId) {
    await db.execute('DELETE FROM sessions WHERE session_id = ?', [sessionId]);
};

exports.getUserIdBySession = async function getUserIdBySession(sessionId) {
    const [rows] = await db.execute(
        'SELECT user_id FROM sessions WHERE session_id = ? AND expires_at > NOW()',
        [sessionId]
    );
    return rows[0]?.user_id || null;
};

exports.updateWantsUpdates = async function updateWantsUpdates(userId, wantsUpdates) {
    const query = 'UPDATE users SET wants_updates = ? WHERE user_id = ?';
    try {
        await db.execute(query, [wantsUpdates, userId]);
    } catch (error) {
        throw new Error('Error updating wants_updates: ' + error.message);
    }
};
