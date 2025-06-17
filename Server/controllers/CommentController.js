const CommentService = require('../service/CommentService');

exports.getConfirmedCommentByArticleId = async (req, res) => {
    try {
        const comment = await CommentService.getConfirmedCommentByArticleId(req.params.article_id);
          console.log(comment,'comment');
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPendingCommentByArticleId = async (req, res) => {
    try {
        
        const comment = await CommentService.getPendingComments();
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createComment = async (req, res) => {
    try {
        const newComment = await CommentService.createComment(req.body,req.userId);
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCommentById = async (req, res) => {
    try {
        const updated = await CommentService.updateCommentById(req.params.comment_id, req.body.comment);
        if (!updated) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePartialCommentById = async (req, res) => {
    try {
        const { comment_id } = req.params;
        const updateData = req.body;

        const updatedComment = await CommentService.updatePartialCommentById(comment_id, updateData);

        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCommentById = async (req, res) => {
    try {
        const deleted = await CommentService.deleteCommentById(req.params.comment_id);
        if (!deleted) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
