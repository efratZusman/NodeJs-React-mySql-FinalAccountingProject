const db = require('../../DB/connection');

// Create a new update
exports.createClient = async function createClient({ client_name, logo_url }) {
     try {
   
    const query = 'INSERT INTO clients (client_name, logo_url) VALUES (?, ?)';
    const [result] = await db.execute(query, [client_name, logo_url]);
    const [rows] = await db.execute('SELECT * FROM clients WHERE id = ?', [result.insertId]);
    return rows[0];
     }
     catch (error) {
        throw new Error('Error creating client: ' + error.message);
    }
};


// Get all clients
exports.getAllClients = async function getAllClients() {
    const query = 'SELECT * FROM clients';
    try {
        const [rows] = await db.execute(query);
        // Ensure logo_url is null if empty string
        return rows.map(row => ({
            ...row,
            logo_url: row.logo_url || null
        }));
    } catch (error) {
        console.error('Error in getAllClients:', error);
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
