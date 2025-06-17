module.exports = function validateNewsletter(req, res, next) {
    const { title, date } = req.body;
    if (!title || typeof title !== 'string' || title.length < 2) {
        return res.status(400).json({ error: "Title is required" });
    }
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ error: "Date is required (YYYY-MM-DD)" });
    }
    next();
};