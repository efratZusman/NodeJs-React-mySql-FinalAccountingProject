const db = require('../../DB/connection');
const fs = require('fs');
const path = require('path');

exports.createClient = async function createClient({ client_name, logo_url }) {
    try {
        const query = 'INSERT INTO clients (client_name, logo_url) VALUES (?, ?)';
        const [result] = await db.execute(query, [client_name, logo_url]);
        const [rows] = await db.execute('SELECT * FROM clients WHERE id = ?', [result.insertId]);
        return rows[0];
    } catch (error) {
        throw new Error('Error creating client: ' + error.message);
    }
};

exports.getAllClients = async function getAllClients() {
    try {
        const query = 'SELECT * FROM clients';
        const [rows] = await db.execute(query);
        return rows.map(row => ({
            ...row,
            logo_url: row.logo_url || null
        }));
    } catch (error) {
        throw new Error('Error fetching clients: ' + error.message);
    }
};

exports.getClientById = async function getClientById(clientId) {
    try {
        const query = 'SELECT * FROM clients WHERE id = ?';
        const [rows] = await db.execute(query, [clientId]);
        return rows[0] || null;
    } catch (error) {
        throw new Error('Error fetching client: ' + error.message);
    }
};

exports.deleteClientById = async function deleteClientById(clientId) {
    try {
        const client = await this.getClientById(clientId);
        if (!client) {
            return false;
        }

        if (client.logo_url) {
            const filename = path.basename(client.logo_url); 
            const filePath = path.join(__dirname, '../images', filename); 
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            } else {
                console.warn("File not found:", filePath);
            }
        }
        const query = 'DELETE FROM clients WHERE id = ?';
        const [result] = await db.execute(query, [clientId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error deleting client: ' + error.message);
    }
};

exports.createComment = async function createComment(commentData, userId) {
    const { article_id, comment } = commentData;
    const query = `
        INSERT INTO articles_comments (article_id, user_id, comment)
        VALUES (?, ?, ?)
    `;
    const values = [article_id, userId, comment];

    try {
        const [result] = await db.execute(query, values);
        const newCommentId = result.insertId;

        const fetchQuery = `
            SELECT articles_comments.id, articles_comments.comment, articles_comments.created_at, users.user_id, users.full_name, users.email
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

exports.getConfirmedCommentByArticleId = async function getConfirmedCommentByArticleId(articleId) {
    const query = `
        SELECT articles_comments.id, articles_comments.comment, articles_comments.created_at, users.full_name, users.email
        FROM articles_comments
        JOIN users ON articles_comments.user_id = users.user_id
        WHERE articles_comments.article_id = ? AND articles_comments.status = 'confirmed'
        ORDER BY articles_comments.created_at DESC
    `;

    try {
        const [rows] = await db.execute(query, [articleId]);
        return rows;
    } catch (error) {
        throw new Error('Error fetching comments by article ID: ' + error.message);
    }
};

exports.getPendingComments = async function getPendingComments() {
    const query = `
        SELECT articles_comments.id, articles_comments.comment, articles_comments.created_at, users.full_name, users.email
        FROM articles_comments
        JOIN users ON articles_comments.user_id = users.user_id
        WHERE articles_comments.status = 'pending'
        ORDER BY articles_comments.created_at DESC
    `;
    try {
        const [rows] = await db.execute(query, []);
        return rows;
    } catch (error) {
        throw new Error('Error fetching comments by article ID: ' + error.message);
    }
};

exports.updateCommentById = async function updateCommentById(commentId, Data) {
    const { comment, status } = Data;
    
    const query = `
        UPDATE articles_comments
        SET comment = ? , status = ?
        WHERE id = ?
    `;
    const values = [comment, status, commentId];

    try {
        const [result] = await db.execute(query, values);

        if (result.affectedRows > 0) {
            const fetchQuery = `
                SELECT articles_comments.id, articles_comments.comment, articles_comments.created_at, users.full_name, users.email
                FROM articles_comments
                JOIN users ON articles_comments.user_id = users.user_id
                WHERE articles_comments.id = ?
            `;
            const [rows] = await db.execute(fetchQuery, [commentId]);

            return rows[0];
        } else {
            return null;
        }
    } catch (error) {
        throw new Error('Error updating comment: ' + error.message);
    }
};

exports.deleteCommentById = async function deleteCommentById(commentId) {
    const query = 'DELETE FROM articles_comments WHERE id = ?';
    try {
        const [result] = await db.execute(query, [commentId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error deleting comment: ' + error.message);
    }
};

exports.updatePartialCommentById = async function updatePartialCommentById(commentId, updateData) {
    const fields = [];
    const values = [];

    for (const key in updateData) {
        if (['id', 'user_id', 'article_id', 'created_at'].includes(key)) continue;

        fields.push(`${key} = ?`);
        values.push(updateData[key]);
    }

    if (fields.length === 0) {
        return null;
    }

    const query = `
        UPDATE articles_comments
        SET ${fields.join(', ')}
        WHERE id = ?
    `;
    values.push(commentId);

    try {
        const [result] = await db.execute(query, values);

        if (result.affectedRows === 0) {
            return null;
        }

        const fetchQuery = `
            SELECT articles_comments.id, articles_comments.comment, articles_comments.status, articles_comments.created_at, users.full_name, users.email
            FROM articles_comments
            JOIN users ON articles_comments.user_id = users.user_id
            WHERE articles_comments.id = ?
        `;
        const [rows] = await db.execute(fetchQuery, [commentId]);
        return rows[0];
    } catch (error) {
        throw new Error('Error partially updating comment: ' + error.message);
    }
};
