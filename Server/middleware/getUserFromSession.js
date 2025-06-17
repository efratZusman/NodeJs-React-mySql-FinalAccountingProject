
const UserService = require('../service/UserService');

async function getUserFromSession(req, res, next) {
  try {
    const sessionId = req.cookies?.session_id;

    if (!sessionId) {
      return res.status(200).json(null);
    }

    const {userId,role} = await UserService.getUserDetailsBySession(sessionId);
    if (!userId||!role) {
      return res.status(401).json({ error: 'Invalid session' });
    }
    console.log("userId", userId);

    req.userId = userId;
    req.userRole = role;

    next(); 
  } catch (err) {
    next(err); 
  }
}

module.exports = getUserFromSession;