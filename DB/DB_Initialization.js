const connection = require('./connection');

const initDb = async () => {
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS accounting_db`);
    await connection.query(`USE accounting_db`);
    await connection.query(`DROP TABLE IF EXISTS sessions, articles_comments, articles, article_contents, newsletters,session, update_subscriptions, updates, clients, passwords, users`);

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
        content TEXT NOT NULL
      );
    `);

    await connection.query(`
      CREATE TABLE articles_comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        article_id INT NOT NULL,
        user_id INT NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES articles(id),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
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
  UNIQUE (user_id, update_id) -- למנוע כפילויות
);
  `);
    await connection.query(`
      INSERT INTO updates (date, title, content) VALUES
('2025-06-10', 'תקציב החינוך לשנת הלימודים תשפ"ו אושר', 'משרד החינוך פרסם את תקציבו המעודכן לשנת הלימודים הקרובה, הכולל תוספת של 1.2 מיליארד ש"ח לטובת תוכניות מצוינות, תמיכה בפריפריה והרחבת שירותי רווחה בבתי הספר.'),
('2025-05-28', 'מענק חד-פעמי למורי החינוך המיוחד', 'שרת החינוך הודיעה על מתן מענק בסך 3,000 ש"ח למורי חינוך מיוחד, בשל עומס חריג בשנת הלימודים והרחבת כיתות שילוב.'),
('2025-06-01', 'ביקורת חריפה על אופן חלוקת התקציבים בין ערים', 'דו"ח מבקר המדינה מצא פערים של עד 70% בהקצאת תקציבי חינוך בין מרכז לפריפריה. משרד החינוך הגיב: "נפעל לתיקון אי השוויון בתקופה הקרובה."'),
('2025-04-18', 'תוכנית חדשה להנגשת לימודי מחשב בפריפריה', 'הממשלה אישרה תוכנית לחיזוק לימודי מחשב בערי פריפריה, בעלות של 250 מיליון ש"ח. התוכנית תתפרס על פני 3 שנים ותכלול הכשרות מורים, ציוד טכנולוגי ומעבדות חכמות.'),
('2025-03-02', 'השקת מערכת שקיפות תקציבית חדשה למוסדות חינוך', 'משרד החינוך השיק אתר חדש בו ניתן לראות את חלוקת התקציבים לכל בית ספר בארץ – על בסיס מיקום, מגזר, ואופי האוכלוסייה.'),
('2025-01-15', 'תוספת תקציב למלגות לסטודנטים להוראה', 'בעקבות מחסור במורים, אושרה תוספת של 120 מיליון ש"ח לקרן המלגות הארצית ללימודי הוראה. המלגות יינתנו בעיקר לסטודנטים במסלולי מתמטיקה, מדעים ואנגלית.'),
('2025-06-05', 'נבחנת הרחבת יום הלימודים בבתי ספר יסודיים', 'ועדת החינוך דנה באפשרות להאריך את יום הלימודים עד השעה 16:00. מדובר בהשקעה נוספת של חצי מיליארד ש"ח, במטרה לצמצם פערים ולהקל על הורים עובדים.'),
('2025-02-10', 'שיפוץ מוסדות חינוך: תוכנית לאומית יוצאת לדרך', 'הממשלה הכריזה על השקעה של 2 מיליארד ש"ח בשיפוץ מוסדות חינוך ישנים. העבודות יתחילו בקיץ הקרוב, בדגש על בטיחות, נגישות ואקלים לימודי מתקדם.');
  `);
    console.log("Database initialized successfully.");
  } catch (err) {
    console.error("Error initializing database:", err);
  } finally {
    await connection.end();
  }
};

initDb();
