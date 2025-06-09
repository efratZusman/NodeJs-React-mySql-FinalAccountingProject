

const db = require('../../DB/connection');

exports.createInformation = async function createInformation(infoData) {
    const { title, excerpt, content } = infoData;

    const insertArticleQuery = `
        INSERT INTO articles (title, excerpt) 
        VALUES (?, ?)
    `;
    const articleValues = [title, excerpt];

    try {
        const [result] = await db.execute(insertArticleQuery, articleValues);
        const articleId = result.insertId;

        const insertContentQuery = `
            INSERT INTO article_contents (article_id, content)
            VALUES (?, ?)
        `;
        await db.execute(insertContentQuery, [articleId, content]);

        const [insertedInfo] = await db.execute('SELECT * FROM articles WHERE id = ?', [articleId]);
        return insertedInfo[0];
    } catch (error) {
        throw new Error('Error creating info: ' + error.message);
    }
};

exports.getAllinformation = async function getAllinformation() {
    const query = 'SELECT * FROM articles ORDER BY created_at DESC';
    try {
        const [rows] = await db.execute(query);
        return rows;
    } catch (error) {
        throw new Error('Error fetching information: ' + error.message);
    }
};

exports.getInformationById = async function getInformationById(id) {
    const query = `
        SELECT a.id, a.title, a.excerpt,  a.created_at, c.content
        FROM articles a
        JOIN article_contents c ON a.id = c.article_id
        WHERE a.id = ?
    `;
    try {
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    } catch (error) {
        throw new Error('Error fetching information by ID: ' + error.message);
    }
};

exports.updateInformationById = async function updateInformationById(infoId, infoData) {
    const { title, excerpt, content } = infoData;

    const updateArticleQuery = `
        UPDATE articles 
        SET title = ?, excerpt = ?
        WHERE id = ?
    `;
    const articleValues = [title, excerpt, infoId];

    const updateContentQuery = `
        UPDATE article_contents 
        SET content = ?
        WHERE article_id = ?
    `;

    try {
        const [articleResult] = await db.execute(updateArticleQuery, articleValues);
        const [contentResult] = await db.execute(updateContentQuery, [content, infoId]);

        if (articleResult.affectedRows > 0 || contentResult.affectedRows > 0) {
            return await this.getInformationById(infoId);
        }
        return null;
    } catch (error) {
        throw new Error('Error updating info: ' + error.message);
    }
};

exports.deleteInformationById = async function deleteInformationById(infoId) {
    const deleteQueryArticle = 'DELETE FROM articles WHERE id = ?';
    const deleteQueryArticleContent = 'DELETE FROM article_contents WHERE id = ?';

    try {
        const [result] = await db.execute(deleteQuery, [infoId]);
        if( result.affectedRows > 0)
        {
            await db.execute(deleteQueryArticleContent, [infoId]);
            return true;
        }
        return false;
    } catch (error) {
        throw new Error('Error deleting info: ' + error.message);
    }
};

