
const UserService = require('../service/UserService');

async function getUserFromSession(req, res, next) {
  try {
    // 1. לקרוא את הקוקי session_id
    const sessionId = req.cookies?.session_id;

    if (!sessionId) {
      return res.status(200).json(null);
    }

    // 2. לחלץ את userId מה-session
    const {userId,role} = await UserService.getUserDetailsBySession(sessionId);
    if (!userId||!role) {
      return res.status(401).json({ error: 'Invalid session' });
    }
    console.log("userId", userId);

    // 3. לשים את userId ב-request שיהיה נגיש לכל רוטר או קונטרולר
    req.userId = userId;
    req.userRole = role;

    next(); // ממשיכים לרוטר הבא
  } catch (err) {
    next(err); // אם יש שגיאה, מעבירים ל-Express error handler
  }
}

module.exports = getUserFromSession;