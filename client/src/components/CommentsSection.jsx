import React, { useEffect, useState } from 'react';
import styles from '../styles/CommentsSection.module.css';
import { useUserContext } from './UserContext';
import ApiService from '../ApiService';

const apiService = new ApiService();

const CommentsSection = ({ articleId }) => {
    const { user } = useUserContext();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadComments();
    }, [articleId]);

    const loadComments = async () => {
        try {
            const data = await apiService.get(`/information/${articleId}/comments`);
            setComments(data);
        } catch (err) {
            console.error('שגיאה בטעינת תגובות', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const response = await apiService.post(`/information/comments`, {
                comment: newComment,
                article_id:articleId,
            });
            setComments([response, ...comments]);
            setNewComment('');
        } catch (err) {
            console.log(err,'err');
            
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

            {loading ? (
                <p>טוען תגובות...</p>
            ) : comments.length === 0 ? (
                <p>אין תגובות עדיין.</p>
            ) : (
                <ul className={styles.commentList}>
                    {comments.map((comment) => (
                        <li key={comment.id} className={styles.commentItem}>
                            <div className={styles.commentHeader}>
                                <span className={styles.username}>{comment.username}</span>
                                <span className={styles.date}>{new Date(comment.created_at).toLocaleString()}</span>
                            </div>
                            <p className={styles.commentText}>{comment.comment}</p>
                            {user?.user_id === comment.user_id && (
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDeleteComment(comment.id)}
                                >
                                    מחק
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CommentsSection;
