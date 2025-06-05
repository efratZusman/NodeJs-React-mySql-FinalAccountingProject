const db = require('../../DB/connection');

// Create new comment
exports.createComment = async function createComment(commentData) {
    const { newsletter_id, user_id, comment } = commentData;
    const query = `
        INSERT INTO newsletter_comments (newsletter_id, user_id, comment)
        VALUES (?, ?, ?)
    `;
    const values = [newsletter_id, user_id, comment];

    try {
        const [result] = await db.execute(query, values);
        const newCommentId = result.insertId;

        // Fetch the newly created comment along with user details
        const fetchQuery = `
            SELECT newsletter_comments.id, newsletter_comments.comment, newsletter_comments.CreatedAt, users.user_id, users.full_name, users.email
            FROM newsletter_comments
            JOIN users ON newsletter_comments.user_id = users.user_id
            WHERE newsletter_comments.id = ?
        `;
        const [rows] = await db.execute(fetchQuery, [newCommentId]);
        return rows[0];
    } catch (error) {
        throw new Error('Error creating comment: ' + error.message);
    }
};

// Get comment by ID
exports.getCommentsByNewsletterId = async function getCommentsByPostId(newsletterId) {
    const query = `
        SELECT newsletter_comments.id, newsletter_comments.comment, newsletter_comments.CreatedAt, users.full_name, users.email
        FROM newsletter_comments
        JOIN Users ON newsletter_comments.user_id = users.user_id
        WHERE newsletter_comments.newsletter_id = ?
        ORDER BY newsletter_comments.CreatedAt ASC
    `;
    try {
        const [rows] = await db.execute(query, [newsletterId]);
        return rows;
    } catch (error) {
        throw new Error('Error fetching comments by post ID: ' + error.message);
    }
};

// Update comment by ID
exports.updateCommentById = async function updateCommentById(commentId, content) {
    const query = `
        UPDATE newsletter_comments
        SET comment = ?
        WHERE id = ?
    `;
    const values = [content, commentId];

    try {
        const [result] = await db.execute(query, values);

        if (result.affectedRows > 0) {
            // Fetch the updated comment
            const fetchQuery = `
                SELECT newsletter_comments.id, newsletter_comments.comment, Comments.CreatedAt, users.full_name, users.email
                FROM newsletter_comments
                JOIN users ON newsletter_comments.user_id = users.user_id
                WHERE newsletter_comments.id = ?
            `;
            const [rows] = await db.execute(fetchQuery, [commentId]);
            return rows[0];
        } else {
            return null; // No rows were updated
        }
    } catch (error) {
        throw new Error('Error updating comment: ' + error.message);
    }
};

// Delete comment by ID
exports.deleteCommentById = async function deleteCommentById(commentId) {
    const query = 'DELETE FROM newsletter_comments WHERE id = ?';
    try {
        const [result] = await db.execute(query, [commentId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error deleting comment: ' + error.message);
    }

    
};