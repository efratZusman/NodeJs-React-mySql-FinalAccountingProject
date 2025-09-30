const mysql = require('mysql2');
require('dotenv').config({ path: '../.env' }); 

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
     database: process.env.MYSQL_DATABASE,
    port: process.env.DATABASE_PORT
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to alwaysData!');
});

 module.exports = connection.promise();

 