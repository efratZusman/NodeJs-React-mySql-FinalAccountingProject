const db = require('../../DB/connection');

// Create new post
exports.createPost = async function createPost(postData) {
    const { userId, title, content } = postData;
    const query = `
        INSERT INTO Posts (UserID, Title, Content)
        VALUES (?, ?, ?)
    `;
    const values = [userId, title, content];

    try {
        const [result] = await db.execute(query, values);
        const insertedPostQuery = 'SELECT * FROM Posts WHERE PostID = ?';
        const [insertedPost] = await db.execute(insertedPostQuery, [result.insertId]);
        return insertedPost[0];
    } catch (error) {
        throw new Error('Error creating post: ' + error.message);
    }
};

exports.partialUpdatePostById = async (id, updates) => {
    try {
        const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
        const values = Object.values(updates);
        const query = `UPDATE posts SET ${fields} WHERE id = ?`;
        const [result] = await connection.execute(query, [...values, id]);
        return result.affectedRows > 0 ? { id, ...updates } : null;
    } catch (error) {
        console.error('Error in partialUpdatePostById service:', error);
        throw error;
    }
};
// Get post by ID
exports.getPostById = async function getPostById(postId) {
    const query = 'SELECT * FROM Posts WHERE PostID = ?';
    try {
        const [rows] = await db.execute(query, [postId]);
        return rows[0];
    } catch (error) {
        throw new Error('Error fetching post: ' + error.message);
    }
};

// Get all posts (optionally by user)
exports.getAllPosts = async function getAllPosts(userId = null) {
    const query = userId 
        ? 'SELECT * FROM Posts WHERE UserID = ?'
        : 'SELECT * FROM Posts';
    const values = userId ? [userId] : [];

    try {
        const [rows] = await db.execute(query, values);
        return rows;
    } catch (error) {
        throw new Error('Error fetching posts: ' + error.message);
    }
};

// Update post by ID
exports.updatePostById = async function updatePostById(postId, postData) {
    const { content } = postData;
    const query = `
        UPDATE Posts 
        SET Content = ?
        WHERE PostID = ?
    `;
    const values = [content, postId];

    try {
        const [result] = await db.execute(query, values);
        if (result.affectedRows > 0) {
            const updatedPostQuery = 'SELECT * FROM Posts WHERE PostID = ?';
            const [updatedRows] = await db.execute(updatedPostQuery, [postId]);
            return updatedRows[0];
        }
        return null;
    } catch (error) {
        throw new Error('Error updating post: ' + error.message);
    }
};

// Delete post by ID
exports.deletePostById = async function deletePostById(postId) {
    const query = 'DELETE FROM Posts WHERE PostID = ?';
    try {
        const [result] = await db.execute(query, [postId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error deleting post: ' + error.message);
    }
};
