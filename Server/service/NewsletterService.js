const db = require('../../DB/connection');
const fs = require('fs');
const path = require('path');

exports.createNewsletter = async function createNewsletter(newsletterData) {
  const { date, title, filePath } = newsletterData; 

  const query = `
    INSERT INTO newsletters (date, title, filePath)
    VALUES (?, ?, ?)
  `;
  const values = [date, title, filePath];

  try {
    const [result] = await db.execute(query, values);
    const [inserted] = await db.execute('SELECT * FROM newsletters WHERE id = ?', [result.insertId]);
    return inserted[0];
  } catch (error) {
    throw new Error('Error creating newsletter: ' + error.message);
  }
};

exports.getAllNewsletters = async function getAllNewsletters() {
  const query = 'SELECT * FROM newsletters';
  try {
    const [rows] = await db.execute(query);
    return rows;
  } catch (error) {
    throw new Error('Error fetching newsletters: ' + error.message);
  }
};

exports.updateNewsletterById = async function updateNewsletterById(newsletterId, newsletterData) {
  const { title, filePath, date } = newsletterData;
  const query = `
    UPDATE newsletters
    SET title = ?, filePath = ?, date = ?
    WHERE id = ?
  `;
  const values = [title, filePath, date, newsletterId];

  try {
    const [result] = await db.execute(query, values);
    if (result.affectedRows > 0) {
      const [updated] = await db.execute('SELECT * FROM newsletters WHERE id = ?', [newsletterId]);
      return updated[0];
    }
    return null;
  } catch (error) {
    throw new Error('Error updating newsletter: ' + error.message);
  }
};

exports.deleteNewsletterById = async function deleteNewsletterById(newsletterId) {
    try {
        const [rows] = await db.execute('SELECT * FROM newsletters WHERE id = ?', [newsletterId]);
        const newsletter = rows[0];
        if (!newsletter) return false;

        if (newsletter.filePath) {
            const filePath = path.join(__dirname, '..', newsletter.filePath);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            } else {
                console.warn("Newsletter file not found:", filePath);
            }
        }

        const [result] = await db.execute('DELETE FROM newsletters WHERE id = ?', [newsletterId]);
            return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error deleting newsletter: ' + error.message);
    }
};
