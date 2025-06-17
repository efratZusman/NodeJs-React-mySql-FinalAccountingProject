const express = require('express');
const commentController = require('../controllers/CommentController');

const router = express.Router();

router.post('/', commentController.createComment);
router.get('/admin/:article_id', commentController.getConfirmedCommentByArticleId);
router.get('/users/:article_id', commentController.getPendingCommentByArticleId);

router.put('/:id', commentController.updateCommentById);
router.delete('/:id', commentController.deleteCommentById);

module.exports = router;
