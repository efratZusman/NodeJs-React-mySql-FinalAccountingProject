const db = require('../../DB/connection');

exports.createInformation = async function createInformation(infoData) {
    const {  title, content, link_url, link_type } = infoData;
    const query = `
        INSERT INTO info_items (title, content, link_url, link_type) 
        VALUES (?, ?, ?, ?)
    `;
    const values = [title, content, link_url, link_type];

    try {
        const [result] = await db.execute(query, values);
        const insertedInfoQuery = 'SELECT * FROM info_items WHERE id = ?';
        const [insertedInfo] = await db.execute(insertedInfoQuery, [result.insertId]);
        return insertedInfo[0];
    } catch (error) {
        throw new Error('Error creating info: ' + error.message);
    }
};


exports.getAllInformations = async function getAllInformations() {
    const query = 'SELECT * FROM info_items';
    try {
        const [rows] = await db.execute(query);
        return rows;
    } catch (error) {
        throw new Error('Error fetching information: ' + error.message);
    }
};

exports.updateInformationById = async function updateInformationById(infoId, infoData) {
    const {  title, content, link_url, link_type } = infoData;
    const query = `
        UPDATE info_items 
        SET title = ?, content = ?, link_url = ?, link_type = ?
        WHERE id = ?
    `; 
    const values = [title, content, link_url, link_type, infoId];


    try {
        const [result] = await db.execute(query, values);
        if (result.affectedRows > 0) {
            const updatedInfoQuery = 'SELECT * FROM info_items WHERE id = ?';
            const [updatedInfo] = await db.execute(updatedInfoQuery, [infoId]);
            return updatedInfo[0];
        }
        return null;
    } catch (error) {
        throw new Error('Error updating info: ' + error.message);
    }
};

exports.deleteInformationById = async function deleteInformationById(infoId) {
    const query = 'DELETE FROM info_items WHERE id = ?';
    try {
        const [result] = await db.execute(query, [infoId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error deleting info: ' + error.message);
    }
};


