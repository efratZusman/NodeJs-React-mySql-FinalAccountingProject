import React, { useEffect, useState } from 'react';
import styles from '../styles/CommentsSection.module.css';
import { useUserContext } from './UserContext';
import ApiService from '../ApiService';
import { validateComment, VALIDATION_MESSAGES } from '../utils/validation';
import PendingCommentsManager from './PendingCommentsManager';

const apiService = new ApiService();

const CommentsSection = ({ articleId }) => {
    const { user } = useUserContext();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [commentError, setCommentError] = useState('');

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState('');
    const [editError, setEditError] = useState('');
    const [showManage, setShowManage] = useState(false);

    useEffect(() => {
        loadComments();
    }, [articleId]);

    const loadComments = async () => {
        try {
            const data = await apiService.get(`/information/${articleId}/comments/users/confirmed`);
            setComments(data);
        } catch (err) {
            console.error('שגיאה בטעינת תגובות', err);
            setError('אירעה שגיאה בטעינת התגובות. נסה לרענן את הדף.');
        } finally {
            setLoading(false);
        }
    };

    const validateCommentInput = (comment) => {
        if (!validateComment(comment)) {
            setCommentError(VALIDATION_MESSAGES.COMMENT);
            return false;
        }
        setCommentError('');
        return true;
    };

    const handleAddComment = async () => {
        if (!validateCommentInput(newComment)) return;
        
        try {
            const response = await apiService.post(`/information/comments`, {
                comment: newComment.trim(),
                article_id: articleId,
            });

            // השלמת נתונים כדי לאפשר תצוגה מיידית כולל כפתורים
            const enrichedResponse = {
                ...response,
                user_id: user.user_id,
                username: user.username,
                created_at: new Date().toISOString(),
            };

            setComments([enrichedResponse, ...comments]);
            setNewComment('');
            setCommentError('');
        } catch (err) {
            console.error('שגיאה בשליחת תגובה:', err);
            setError('אירעה שגיאה בשליחת התגובה. אנא נסה שוב.');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('האם אתה בטוח שברצונך למחוק תגובה זו?')) return;
        
        try {
            await apiService.delete(`/information/comments/${commentId}`);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (err) {
            console.error('שגיאה במחיקת תגובה:', err);
            setError('אירעה שגיאה במחיקת התגובה. אנא נסה שוב.');
        }
    };

    const handleUpdateComment = async (commentId) => {
        if (!validateCommentInput(editedComment)) return;
        
        try {
            const updated = await apiService.put(`/information/comments/${commentId}`, {
                comment: editedComment.trim(),
            });

            setComments(comments.map(c => {
                if (c.id === commentId) {
                    return {
                        ...updated,
                        created_at: updated.created_at || c.created_at,
                        username: c.username,
                        user_id: c.user_id,
                    };
                }
                return c;
            }));


            setEditingCommentId(null);
            setEditedComment('');
            setEditError('');
        } catch (err) {
            console.error('שגיאה בעדכון תגובה:', err);
            setEditError('אירעה שגיאה בעדכון התגובה. אנא נסה שוב.');
        }
    };

    const startEditing = (comment) => {
        setEditingCommentId(comment.id);
        setEditedComment(comment.comment);
        setEditError('');
    };

    const cancelEditing = () => {
        setEditingCommentId(null);
        setEditedComment('');
        setEditError('');
    };

    if (loading) {
        return <div className={styles.loading}>טוען תגובות...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.commentsSection}>
            <div className={styles.commentsHeader}>
                <h3>תגובות ({comments.length})</h3>
                {user?.role === 'admin' && (
                    <button 
                        className={styles.manageButton}
                        onClick={() => setShowManage(!showManage)}
                    >
                        {showManage ? 'סגור ניהול' : 'ניהול תגובות ממתינות'}
                    </button>
                )}
            </div>

            {showManage && user?.role === 'admin' && (
                <div className={styles.pendingComments}>
                    <PendingCommentsManager 
                        articleId={articleId} 
                        onApprove={loadComments} 
                    />
                </div>
            )}

            {user ? (
                <div className={styles.addComment}>
                    <h4>הוסף תגובה:</h4>
                    <textarea
                        className={`${styles.commentInput} ${commentError ? styles.inputError : ''}`}
                        value={newComment}
                        onChange={(e) => {
                            setNewComment(e.target.value);
                            if (commentError) validateCommentInput(e.target.value);
                        }}
                        placeholder="כתוב את תגובתך כאן..."
                        rows="4"
                    />
                    {commentError && <div className={styles.errorText}>{commentError}</div>}
                    <div className={styles.commentActions}>
                        <div className={styles.charCount}>
                            {newComment.length}/1000 תווים
                        </div>
                        <button 
                            className={styles.submitButton}
                            onClick={handleAddComment}
                            disabled={!newComment.trim() || !!commentError}
                        >
                            שלח תגובה
                        </button>
                    </div>
                </div>
            ) : (
                <div className={styles.loginPrompt}>
                    <p>עליך <a href="/login">להתחבר</a> כדי להגיב</p>
                </div>
            )}

            <div className={styles.commentsList}>
                {comments.length === 0 ? (
                    <p className={styles.noComments}>אין תגובות עדיין. היה הראשון להגיב!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className={styles.comment}>
                            <div className={styles.commentHeader}>
                                <span className={styles.commentAuthor}>
                                    {comment.username || 'אורח'}
                                </span>
                                <span className={styles.commentDate}>
                                    {new Date(comment.created_at).toLocaleDateString('he-IL')}
                                </span>
                            </div>

                            {editingCommentId === comment.id ? (
                                <div className={styles.editComment}>
                                    <textarea
                                        className={`${styles.editCommentInput} ${editError ? styles.inputError : ''}`}
                                        value={editedComment}
                                        onChange={(e) => {
                                            setEditedComment(e.target.value);
                                            if (editError) setEditError('');
                                        }}
                                        rows="4"
                                    />
                                    {editError && <div className={styles.errorText}>{editError}</div>}
                                    <div className={styles.editActions}>
                                        <div className={styles.charCount}>
                                            {editedComment.length}/1000 תווים
                                        </div>
                                        <div>
                                            <button 
                                                className={styles.cancelButton}
                                                onClick={cancelEditing}
                                            >
                                                ביטול
                                            </button>
                                            <button 
                                                className={styles.saveButton}
                                                onClick={() => handleUpdateComment(comment.id)}
                                                disabled={!editedComment.trim() || !!editError}
                                            >
                                                שמור שינויים
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.commentContent}>
                                    {comment.comment}
                                </div>
                            )}

                            {(user?.role === 'admin' || user?.user_id === comment.user_id) && (
                                <div className={styles.commentActions}>
                                    {editingCommentId !== comment.id && (
                                        <button 
                                            className={styles.editButton}
                                            onClick={() => startEditing(comment)}
                                        >
                                            ערוך
                                        </button>
                                    )}
                                    <button 
                                        className={styles.deleteButton}
                                        onClick={() => handleDeleteComment(comment.id)}
                                    >
                                        מחק
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentsSection;
