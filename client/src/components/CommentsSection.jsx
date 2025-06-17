import React, { useEffect, useState } from 'react';
import styles from '../styles/CommentsSection.module.css';
import { useUserContext } from './UserContext';
import ApiService from '../ApiService';
import { validateNotEmpty } from '../utils/validation';
import PendingCommentsManager from './PendingCommentsManager';

const apiService = new ApiService();

const CommentsSection = ({ articleId }) => {
    const { user } = useUserContext();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState('');
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
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!validateNotEmpty(newComment)) return alert('אנא כתוב תגובה לפני שליחה.');
        try {
            const response = await apiService.post(`/information/comments`, {
                comment: newComment,
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
        } catch (err) {
            console.log(err, 'err');
            alert('שגיאה בשליחת תגובה');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('למחוק תגובה זו?')) return;
        try {
            await apiService.delete(`/information/comments/${commentId}`);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (err) {
            alert('שגיאה במחיקת תגובה');
        }
    };

    const handleUpdateComment = async (commentId) => {
        if (!validateNotEmpty(editedComment)) return alert('התגובה לא יכולה להיות ריקה.');
        try {
            const updated = await apiService.put(`/information/comments/${commentId}`, {
                comment: editedComment,
            });

            setComments(comments.map(c => {
                if (c.id === commentId) {
                    return {
                        ...updated,
                        created_at: updated.created_at ? updated.created_at : c.created_at,
                        username: c.username,
                        user_id: c.user_id,
                    };
                }
                return c;
            }));

            setEditingCommentId(null);
            setEditedComment('');
        } catch (err) {
            alert('שגיאה בעדכון תגובה');
        }
    };

    return (
        <div className={styles.commentsContainer}>
            <h4>תגובות</h4>

            {user ? (
                <div className={styles.addCommentBox}>
                    <textarea
                        className={styles.textarea}
                        placeholder="כתוב תגובה..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button className={styles.addButton} onClick={handleAddComment}>הוסף תגובה</button>
                </div>
            ) : (
                <p className={styles.notice}>יש להתחבר כדי להגיב.</p>
            )}

            {user?.role === 'admin' && (
                <button
                    className={styles.manageButton}
                    onClick={() => setShowManage(true)}
                    style={{ marginBottom: 12 }}
                >
                    ניהול תגובות
                </button>
            )}

            {showManage && user?.role === 'admin' && (
                <PendingCommentsManager articleId={articleId} onClose={() => setShowManage(false)} />
            )}

            {loading ? (
                <p>טוען תגובות...</p>
            ) : comments.length === 0 ? (
                <p>אין תגובות עדיין.</p>
            ) : (
                <ul className={styles.commentList}>
                    {comments.map((comment) => {
                        const canModify = user && (user.email === comment.email || user.role=='admin');
                        const isEditing = editingCommentId === comment.id;

                        return (
                            <li key={comment.id} className={styles.commentItem}>
                                <div className={styles.commentHeader}>
                                    <span className={styles.username}>{comment.username}</span>
                                    <span className={styles.date}>
                                        {comment.created_at ? new Date(comment.created_at).toLocaleString() : ''}
                                    </span>
                                </div>

                                {isEditing ? (
                                    <>
                                        <textarea
                                            className={styles.textarea}
                                            value={editedComment}
                                            onChange={(e) => setEditedComment(e.target.value)}
                                        />
                                        <button onClick={() => handleUpdateComment(comment.id)}>שמור</button>
                                        <button onClick={() => setEditingCommentId(null)}>בטל</button>
                                    </>
                                ) : (
                                    <p className={styles.commentText}>{comment.comment}</p>
                                )}

                                {canModify && !isEditing && (
                                    <>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => handleDeleteComment(comment.id)}
                                        >
                                            מחק
                                        </button>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => {
                                                setEditingCommentId(comment.id);
                                                setEditedComment(comment.comment);
                                            }}
                                        >
                                            עדכן
                                        </button>
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default CommentsSection;
