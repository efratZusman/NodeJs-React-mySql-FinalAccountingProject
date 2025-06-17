module.exports = function validateInformation(req, res, next) {
    const { title, content } = req.body;
    if (!title || typeof title !== 'string' || title.length < 2 || title.length > 255) {
        return res.status(400).json({ error: "Title must be 2-255 chars" });
    }
    if (!content || typeof content !== 'string' || content.length < 10) {
        return res.status(400).json({ error: "Content must be at least 10 chars" });
    }
    next();
};