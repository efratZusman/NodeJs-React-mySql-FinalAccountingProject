const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost', // Replace with your database host
    user: "root", // Replace with your database username from environment variables
    password: 'Efrat12', // Replace with your database password from environment variables
    database: 'accounting_db', // Replace with your database name
    port: 3306, // Replace with your database port if different
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

 