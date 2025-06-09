const db = require('../../DB/connection');

// Create new comment
exports.createComment = async function createComment(commentData) {
    const { article_id, user_id, comment } = commentData;
    const query = `
        INSERT INTO articles_comments (article_id, user_id, comment)
        VALUES (?, ?, ?)
    `;
    const values = [article_id, user_id, comment];

    try {
        const [result] = await db.execute(query, values);
        const newCommentId = result.insertId;

        // Fetch the newly created comment along with user details
        const fetchQuery = `
            SELECT articles_comments.id, articles_comments.comment, articles_comments.CreatedAt, users.user_id, users.full_name, users.email
            FROM articles_comments
            JOIN users ON articles_comments.user_id = users.user_id
            WHERE articles_comments.id = ?
        `;
        const [rows] = await db.execute(fetchQuery, [newCommentId]);
        return rows[0];
    } catch (error) {
        throw new Error('Error creating comment: ' + error.message);
    }
};

// Get comment by ID
exports.getCommentByArticleId = async function getCommentByArticleId(articleId) {
    const query = `
        SELECT articles_comments.id, articles_comments.comment, articles_comments.CreatedAt, users.full_name, users.email
        FROM articles_comments
        JOIN Users ON articles_comments.user_id = users.user_id
        WHERE articles_comments.article_id = ?
        ORDER BY articles_comments.CreatedAt ASC
    `;
    try {
        const [rows] = await db.execute(query, [articleId]);
        return rows;
    } catch (error) {
        throw new Error('Error fetching comments by post ID: ' + error.message);
    }
};

// Update comment by ID
exports.updateCommentById = async function updateCommentById(commentId, content) {
    const query = `
        UPDATE articles_comments
        SET comment = ?
        WHERE id = ?
    `;
    const values = [content, commentId];

    try {
        const [result] = await db.execute(query, values);

        if (result.affectedRows > 0) {
            // Fetch the updated comment
            const fetchQuery = `
                SELECT articles_comments.id, articles_comments.comment, Comments.CreatedAt, users.full_name, users.email
                FROM articles_comments
                JOIN users ON articles_comments.user_id = users.user_id
                WHERE articles_comments.id = ?
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
    const query = 'DELETE FROM articles_comments WHERE id = ?';
    try {
        const [result] = await db.execute(query, [commentId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error deleting comment: ' + error.message);
    }

    
};