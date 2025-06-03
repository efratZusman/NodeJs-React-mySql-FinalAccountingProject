const mysql = require('mysql2');
require('dotenv').config({ path: '../.env' }); // Adjust path if needed

// Create a connection to the database
const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
     database: process.env.MYSQL_DATABASE,
    port: process.env.DATABASE_PORT
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL!');
});

// Export the connection for use in other files
 module.exports = connection.promise();

 