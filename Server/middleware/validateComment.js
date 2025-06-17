module.exports = function validateComment(req, res, next) {
    const { comment, status } = req.body;
    if (comment !== undefined && (typeof comment !== 'string' || comment.trim().length < 1)) {
        return res.status(400).json({ error: "Comment must not be empty" });
    }
    if (status !== undefined && !['pending', 'confirmed'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
    }
    next();
};