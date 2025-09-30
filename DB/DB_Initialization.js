const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' }); 

const initDb = async () => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: process.env.DATABASE_PORT
    });

    console.log("Connected to AlwaysData!");

    const tables = [
      'sessions',
      'articles_comments',
      'article_contents',
      'update_subscriptions',
      'newsletters',
      'articles',
      'updates',
      'clients',
      'passwords',
      'users'
    ];

    for (const table of tables) {
      await connection.query(`DROP TABLE IF EXISTS ${table}`);
    }

    // יצירת טבלאות
    await connection.query(`
      CREATE TABLE users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        role ENUM('user','admin') DEFAULT 'user',
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
      CREATE TABLE articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE article_contents (
        article_id INT PRIMARY KEY,
        content LONGTEXT NOT NULL,
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
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
        filePath VARCHAR(512) NOT NULL
      );
    `);

    await connection.query(`
      CREATE TABLE articles_comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        article_id INT NOT NULL,
        user_id INT NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('pending', 'confirmed') DEFAULT 'pending' NOT NULL,
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      );
    `);

    await connection.query(`
      CREATE TABLE sessions (
        session_id VARCHAR(128) PRIMARY KEY,
        user_id INT NOT NULL,
        expires_at DATETIME NOT NULL
      );
    `);

    await connection.query(`
      CREATE TABLE update_subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        update_id INT NOT NULL,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (update_id) REFERENCES updates(id) ON DELETE CASCADE,
        UNIQUE (user_id, update_id)
      );
    `);

    // הכנסת דוגמאות ל־updates
    await connection.query(`
      INSERT INTO updates (date, title, content) VALUES
      ('2025-06-10','תקציב החינוך לשנת הלימודים תשפ"ו אושר','משרד החינוך פרסם את תקציבו המעודכן...'),
      ('2025-05-28','מענק חד-פעמי למורי החינוך המיוחד','שרת החינוך הודיעה על מתן מענק בסך 3,000 ש"ח...'),
      ('2025-06-01','ביקורת חריפה על אופן חלוקת התקציבים','דו"ח מבקר המדינה מצא פערים של עד 70%...'),
      ('2025-04-18','תוכנית חדשה להנגשת לימודי מחשב בפריפריה','הממשלה אישרה תוכנית לחיזוק לימודי מחשב...'),
      ('2025-03-02','השקת מערכת שקיפות תקציבית חדשה','משרד החינוך השיק אתר חדש בו ניתן לראות את חלוקת התקציבים...'),
      ('2025-01-15','תוספת תקציב למלגות לסטודנטים להוראה','אושרה תוספת של 120 מיליון ש"ח לקרן המלגות...'),
      ('2025-06-05','נבחנת הרחבת יום הלימודים בבתי ספר יסודיים','ועדת החינוך דנה באפשרות להאריך את יום הלימודים...'),
      ('2025-02-10','שיפוץ מוסדות חינוך: תוכנית לאומית יוצאת לדרך','הממשלה הכריזה על השקעה של 2 מיליארד ש"ח בשיפוץ מוסדות חינוך...');
    `);

await connection.query(`
  INSERT INTO users (full_name, email, role, wants_updates)
  VALUES ('Admin', 'avoda010120@gmail.com', 'admin', TRUE)
`);

const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(process.env.MYSQL_PASSWORD, 10);

await connection.query(`
  INSERT INTO passwords (user_id, password_hash)
  VALUES (
    (SELECT user_id FROM users WHERE email='avoda010120@gmail.com'),
    ?
  )
`, [hashedPassword]);

    console.log("Database initialized successfully.");

  } catch (err) {
    console.error("Error initializing database:", err);
  } finally {
    if (connection) await connection.end();
  }
};

initDb();
