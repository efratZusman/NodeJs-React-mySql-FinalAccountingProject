const db = require('../../DB/connection');

// Create a new update
exports.createUpdate = async function createUpdate(updateData) {
    const { date, title, content } = updateData;
    const query = `
        INSERT INTO updates (date, title, content) 
        VALUES (?, ?, ?)
    `;
    const values = [date, title, content];

    try {
        const [result] = await db.execute(query, values);
        const insertedUpdateQuery = 'SELECT * FROM updates WHERE id = ?';
        const [insertedUpdate] = await db.execute(insertedUpdateQuery, [result.insertId]);
        return insertedUpdate[0];
    } catch (error) {
        throw new Error('Error creating update: ' + error.message);
    }
};


// Create a new update
exports.createUpdateSubscription = async function createUpdateSubscription(update_id, user_id) {
    const query = `
        INSERT INTO update_subscriptions (user_id, update_id) 
        VALUES (?, ?)
    `;
    const values = [user_id, update_id];

    try {
        const [result] = await db.execute(query, values);
        const insertedUpdateSubQuery = 'SELECT * FROM update_subscriptions WHERE id = ?';
        const [insertedUpdateSub] = await db.execute(insertedUpdateSubQuery, [result.insertId]);
        return insertedUpdateSub[0];
    } catch (error) {
        throw new Error('Error creating update subscription: ' + error.message);
    }
};


// Get all updates (optionally by user ID)
exports.getAllUpdates = async function getAllUpdates() {
    const query = 'SELECT * FROM updates';
    try {
        const [rows] = await db.execute(query);
        return rows;
    } catch (error) {
        throw new Error('Error fetching updates: ' + error.message);
    }
};

// Get all updates (optionally by user ID)
exports.getUpdatesSubscriptionByUser = async function getUpdatesSubscriptionByUser(userId) {
            console.log("userId in service", userId);

    const query =  'SELECT id, update_id FROM update_subscriptions WHERE user_id = ?';
    try {
        const [rows] = await db.execute(query, [userId]);
        console.log("rows", rows);
        
        return rows;
    } catch (error) {
        throw new Error('Error fetching updates subscriptions: ' + error.message);
    }
};
// Update todo by ID
exports.updateUpdateById = async function updateUpdateById(updateId, updateData) {
    const { title, content, date } = updateData;
    const query = `
        UPDATE updates 
        SET title = ?,  content = ?, date = ?
        WHERE id = ?
    `;
    const values = [title, content, date, updateId];

    try {
        const [result] = await db.execute(query, values);
        if (result.affectedRows > 0) {
            const updatedUpdateQuery = 'SELECT * FROM updates WHERE id = ?';
            const [updatedUpdate] = await db.execute(updatedUpdateQuery, [updateId]);
            return updatedUpdate[0];
        }
        return null;
    } catch (error) {
        throw new Error('Error updating update: ' + error.message);
    }
};

exports.deleteUpdateById = async function deleteUpdateById(updateId) {
    const query = 'DELETE FROM updates WHERE id = ?';
    try {
        const [result] = await db.execute(query, [updateId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error deleting update: ' + error.message);
    }
};

exports.deleteUpdateSubscription = async function deleteUpdateSubscription(updateSubId) {
    const query = 'DELETE FROM update_subscriptions WHERE id = ?';
    try {
        const [result] = await db.execute(query, [updateSubId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error deleting update subsciption: ' + error.message);
    }
};

