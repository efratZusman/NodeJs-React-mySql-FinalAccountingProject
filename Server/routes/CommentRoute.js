const express = require('express');
const commentController = require('../controllers/CommentController');

const router = express.Router();

router.post('/', commentController.createComment);
router.get('/:article_id', commentController.getCommentByArticleId);
router.put('/:id', commentController.updateCommentById);
router.delete('/:id', commentController.deleteCommentById);

module.exports = router;
