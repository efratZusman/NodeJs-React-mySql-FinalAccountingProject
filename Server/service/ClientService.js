const db = require('../../DB/connection');

// Create a new update
exports.createClient = async function createClient(clientData) {
    const { client_name, logo_url } = clientData;
    const query = `
        INSERT INTO clients (client_name, logo_url) 
        VALUES (?,?)
    `;
    const values = [client_name, logo_url];

    try {
        const [result] = await db.execute(query, values);
        const insertedClientQuery = 'SELECT * FROM clients WHERE id = ?';
        const [insertedClient] = await db.execute(insertedClientQuery, [result.insertId]);
        return insertedClient[0];
    } catch (error) {
        throw new Error('Error creating client: ' + error.message);
    }
};


// Get all updates (optionally by user ID)
exports.getAllClients = async function getAllClients() {
    const query = 'SELECT * FROM clients';
    try {
        const [rows] = await db.execute(query);
        return rows;
    } catch (error) {
        throw new Error('Error fetching clients: ' + error.message);
    }
};


exports.deleteClientById = async function deleteClientById(clientId) {
    const query = 'DELETE FROM clients WHERE id = ?';
    try {
        const [result] = await db.execute(query, [clientId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error deleting client: ' + error.message);
    }
};


