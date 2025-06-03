const db = require('../../DB/connection');

// Create new comment
exports.createComment = async function createComment(commentData) {
    const { postId, userId, content } = commentData;
    const query = `
        INSERT INTO Comments (PostID, UserID, Content)
        VALUES (?, ?, ?)
    `;
    const values = [postId, userId, content];

    try {
        const [result] = await db.execute(query, values);
        const newCommentId = result.insertId;

        // Fetch the newly created comment along with user details
        const fetchQuery = `
            SELECT Comments.CommentID, Comments.Content, Comments.CreatedAt, Users.UserID, Users.UserName, Users.Email
            FROM Comments
            JOIN Users ON Comments.UserID = Users.UserID
            WHERE Comments.CommentID = ?
        `;
        const [rows] = await db.execute(fetchQuery, [newCommentId]);
        return rows[0];
    } catch (error) {
        throw new Error('Error creating comment: ' + error.message);
    }
};

// Get comment by ID
exports.getCommentsByPostId = async function getCommentsByPostId(postId) {
    const query = `
        SELECT Comments.CommentID, Comments.Content, Comments.CreatedAt, Users.UserName, Users.Email
        FROM Comments
        JOIN Users ON Comments.UserID = Users.UserID
        WHERE Comments.PostID = ?
        ORDER BY Comments.CreatedAt ASC
    `;
    try {
        const [rows] = await db.execute(query, [postId]);
        return rows;
    } catch (error) {
        throw new Error('Error fetching comments by post ID: ' + error.message);
    }
};

// Get all comments (optionally by post)
exports.getAllComments = async function getAllComments() {
    const query = postId
        ? 'SELECT * FROM Comments WHERE PostID = ?'
        : 'SELECT * FROM Comments';
    const values = postId ? [postId] : [];

    try {
        const [rows] = await db.execute(query, values);
        return rows;
    } catch (error) {
        throw new Error('Error fetching comments: ' + error.message);
    }
};

// Update comment by ID
exports.updateCommentById = async function updateCommentById(commentId, content) {
    const query = `
        UPDATE Comments
        SET Content = ?
        WHERE CommentID = ?
    `;
    const values = [content, commentId];

    try {
        const [result] = await db.execute(query, values);

        if (result.affectedRows > 0) {
            // Fetch the updated comment
            const fetchQuery = `
                SELECT Comments.CommentID, Comments.Content, Comments.CreatedAt, Users.UserName, Users.Email
                FROM Comments
                JOIN Users ON Comments.UserID = Users.UserID
                WHERE Comments.CommentID = ?
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
    const query = 'DELETE FROM Comments WHERE CommentID = ?';
    try {
        const [result] = await db.execute(query, [commentId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error deleting comment: ' + error.message);
    }

    
};
// Get comments by PostID
exports.getCommentsByPostId = async function getCommentsByPostId(postId) {
    const query = `
        SELECT Comments.CommentID, Comments.Content, Comments.CreatedAt, Users.UserName
        FROM Comments
        JOIN Users ON Comments.UserID = Users.UserID
        WHERE Comments.PostID = ?
        ORDER BY Comments.CreatedAt ASC
    `;

    try {
        const [rows] = await db.execute(query, [postId]);
        return rows;
    } catch (error) {
        throw new Error('Error fetching comments: ' + error.message);
    }
};
// Get comments by UserID
exports.getCommentsByUserId = async function getCommentsByUserId(userId) {
    const query = `
        SELECT Comments.CommentID, Comments.Content, Comments.CreatedAt, Posts.Title
        FROM Comments
        JOIN Posts ON Comments.PostID = Posts.PostID
        WHERE Comments.UserID = ?
        ORDER BY Comments.CreatedAt DESC
    `;

    try {
        const [rows] = await db.execute(query, [userId]);
        return rows;
    } catch (error) {
        throw new Error('Error fetching comments: ' + error.message);
    }
};

exports.partialUpdateCommentById = async (id, updates) => {
    try {
        const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
        const values = Object.values(updates);
        const query = `UPDATE comments SET ${fields} WHERE id = ?`;
        const [result] = await connection.execute(query, [...values, id]);
        return result.affectedRows > 0 ? { id, ...updates } : null;
    } catch (error) {
        console.error('Error in partialUpdateCommentById service:', error);
        throw error;
    }
};
