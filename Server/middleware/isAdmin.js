function isAdmin(req, res, next) {
  // בהנחה ש־req.userRole כבר נקבע קודם (למשל במידלוור getUserFromSession)
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next(); // המשתמש הוא admin - ממשיכים הלאה
}

module.exports = isAdmin;