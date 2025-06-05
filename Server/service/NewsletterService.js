const db = require('../../DB/connection');

// Create a new update
exports.createNewsletter = async function createNewsletter(newsletterData) {
    const { date, title, content } = newsletterData;
    const query = `
        INSERT INTO newsletters (date, title, content) 
        VALUES (?, ?, ?)
    `;
    const values = [date, title, content];

    try {
        const [result] = await db.execute(query, values);
        const insertedNewsletterQuery = 'SELECT * FROM newsletters WHERE id = ?';
        const [insertedTodo] = await db.execute(insertedNewsletterQuery, [result.insertId]);
        return insertedTodo[0];
    } catch (error) {
        throw new Error('Error creating newsletter: ' + error.message);
    }
};


// Get all updates (optionally by user ID)
exports.getAllNewsletters = async function getAllNewsletters() {
    const query = 'SELECT * FROM newsletters';
    try {
        const [rows] = await db.execute(query);
        return rows;
    } catch (error) {
        throw new Error('Error fetching newsletter: ' + error.message);
    }
};

// Update todo by ID
exports.updateNewsletterById = async function updateNewsletterById(newsletterId, newsletterData) {
    const { title, content, date } = newsletterData;
    const query = `
        UPDATE newsletters 
        SET title = ?,  content = ?, date = ?
        WHERE id = ?
    `;
    const values = [title, content, date, newsletterId];

    try {
        const [result] = await db.execute(query, values);
        if (result.affectedRows > 0) {
            const updatedNewsletterQuery = 'SELECT * FROM newsletters WHERE id = ?';
            const [updatedNewsletter] = await db.execute(updatedNewsletterQuery, [newsletterId]);
            return updatedNewsletter[0];
        }
        return null;
    } catch (error) {
        throw new Error('Error updating newsletter: ' + error.message);
    }
};

exports.deleteNewsletterById = async function deleteNewsletterById(newsletterId) {
    const query = 'DELETE FROM newsletters WHERE id = ?';
    try {
        const [result] = await db.execute(query, [newsletterId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error deleting newsletter: ' + error.message);
    }
};


