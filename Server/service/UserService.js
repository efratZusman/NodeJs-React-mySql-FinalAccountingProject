const db = require('../../DB/connection');

// Create a new user with password (using transaction)
exports.createUser = async function createUser(userData) {
    const { full_name, email, password_hash } = userData;
    const userQuery = 'INSERT INTO users (full_name, email) VALUES (?, ?)';
    const passwordQuery = 'INSERT INTO passwords (user_id, password_hash) VALUES (?, ?)';
     try {
        const [userResult] = await db.execute(userQuery, [full_name, email]);
        const userId = userResult.insertId;
        await db.execute(passwordQuery,  [userId, password_hash]);
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

// Get all users
exports.getAllUsers = async function getAllUsers() {
    const query = 'SELECT * FROM Users';
    try {
        const [rows] = await db.execute(query);
        return rows;
    } catch (error) {
        throw new Error('Error fetching users: ' + error.message);
    }
};

exports.partialUpdateUserByUsername = async (username, updates) => {
    try {
        const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
        const values = Object.values(updates);
        const query = `UPDATE users SET ${fields} WHERE username = ?`;
        const [result] = await connection.execute(query, [...values, username]);
        return result.affectedRows > 0 ? { username, ...updates } : null;
    } catch (error) {
        console.error('Error in partialUpdateUserByUsername service:', error);
        throw error;
    }
};

// Update user info and password (by username)
exports.updateUserByUsername = async function updateUserByUsername(username, userData) {
    const { email, passwordHash } = userData;

    const userQuery = 'UPDATE Users SET Email = ? WHERE Username = ?';
    const passwordQuery = `
        UPDATE Passwords 
        SET PasswordHash = ? 
        WHERE UserID = (SELECT UserID FROM Users WHERE Username = ?)
    `;
    try {
        
        await db.beginTransaction();

        await db.execute(userQuery, [email, username]);
        await db.execute(passwordQuery, [passwordHash, username]);

        await db.commit();
        return true;
    } catch (error) {
        await db.rollback();
        throw new Error('Error updating user: ' + error.message);
    }
};

// Delete user by username
exports.deleteUserByUsername = async function deleteUserByUsername(username) {
    const query = 'DELETE FROM Users WHERE Username = ?';
    try {
        const [result] = await db.execute(query, [username]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error deleting user: ' + error.message);
    }
};
