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
    const filename = path.basename(client.logo_url); // לדוגמה: 1718123456789-logo.png
    const filePath = path.join(__dirname, '../images', filename); // ניגש לשרת/images
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("File deleted:", filePath);
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
