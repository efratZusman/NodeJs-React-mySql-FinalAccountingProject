 const connection = require('./connection');

const initDb = async () => {
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS accounting_db`);
    await connection.query(`USE accounting_db`);
    await connection.query(`DROP TABLE IF EXISTS newsletter_comments, newsletters, announcements, info_items, clients, passwords, users`);

    await connection.query(`
      CREATE TABLE users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        role ENUM('user', 'admin') DEFAULT 'user',
        wants_updates BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE passwords (
        user_id INT PRIMARY KEY,
        password_hash VARCHAR(255) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      );
    `);

    await connection.query(`
      CREATE TABLE clients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        logo_url VARCHAR(500)
      );
    `);

    await connection.query(`
      CREATE TABLE info_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        link_url VARCHAR(500),
        link_type ENUM('external', 'file')
      );
    `);

    await connection.query(`
      CREATE TABLE updates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL
      );
    `);

    await connection.query(`
      CREATE TABLE newsletters (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL
      );
    `);

    await connection.query(`
      CREATE TABLE newsletter_comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        newsletter_id INT NOT NULL,
        user_id INT NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (newsletter_id) REFERENCES newsletters(id),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      );
    `);

    console.log("Database initialized successfully.");
  } catch (err) {
    console.error("Error initializing database:", err);
  } finally {
    await connection.end();
  }
};

initDb();
