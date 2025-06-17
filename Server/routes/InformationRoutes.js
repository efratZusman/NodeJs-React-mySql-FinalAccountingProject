const express = require('express');
const router = express.Router();
const { uploadArticleFile } = require('../middleware/MulterConfig');
const informationController = require('../controllers/InformationController');
const  getUserFromSession  = require('../middleware/getUserFromSession');
const  isAdmin  = require('../middleware/isAdmin');
const commentController = require('../controllers/CommentController');
const validateInformation = require('../middleware/validateInformation');
const validateComment = require('../middleware/validateComment');

const adminOnly = [getUserFromSession, isAdmin];

router.post('/comments',validateComment,  getUserFromSession,commentController.createComment);
router.get('/comments/admin/pending', [...adminOnly,commentController.getPendingCommentByArticleId]);
router.get('/:article_id/comments/users/confirmed',commentController.getConfirmedCommentByArticleId);
router.put('/comments/:comment_id', getUserFromSession, validateComment, commentController.updateCommentById);
router.patch('/comments/:comment_id', getUserFromSession,commentController.updatePartialCommentById);
router.delete('/comments/:comment_id',getUserFromSession, commentController.deleteCommentById);

router.post('/upload-file', [...adminOnly,uploadArticleFile.single('file'), informationController.uploadInformationFile]);
router.get('/', informationController.getAllinformation);
 router.post('/',validateInformation,  informationController.createInformation);
router.get('/:id', informationController.getInformationById);
router.put('/:id', [...adminOnly, validateInformation, informationController.updateInformationById]);
router.delete('/:id', [...adminOnly,informationController.deleteInformationById]);

module.exports = router;




