import React, { useEffect, useState } from 'react';
import { useUserContext } from './UserContext';
import ApiService from "../utils/ApiService";
import { validateNotEmpty } from '../utils/validation';
import styles from '../styles/CommentsSection.module.css';

const apiService = new ApiService();

function PendingCommentsManager({ onClose }) {
    const { user } = useUserContext();
    const [pendingComments, setPendingComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editedComment, setEditedComment] = useState('');

    useEffect(() => {
        loadPending();
    }, []);

    const loadPending = async () => {
        setLoading(true);
        try {
            const data = await apiService.get('/information/comments/admin/pending'); 
            setPendingComments(data);
        } catch (err) {
            alert('שגיאה בטעינת תגובות ממתינות');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (commentId) => {
        try {
            await apiService.patch(`/information/comments/${commentId}`, { status: 'confirmed' });
            setPendingComments(pendingComments.filter(c => c.id !== commentId));
        } catch {
            alert('שגיאה באישור תגובה');
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm('למחוק תגובה זו?')) return;
        try {
            await apiService.delete(`/information/comments/${commentId}`);
            setPendingComments(pendingComments.filter(c => c.id !== commentId));
        } catch {
            alert('שגיאה במחיקת תגובה');
        }
    };

    const handleEdit = (comment) => {
        setEditingId(comment.id);
        setEditedComment(comment.comment);
    };

    const handleSaveEdit = async (commentId) => {
        if (!validateNotEmpty(editedComment)) return alert('התגובה לא יכולה להיות ריקה.');
        try {
            await apiService.patch(`/information/comments/${commentId}`, { comment: editedComment });
            setPendingComments(pendingComments.map(c =>
                c.id === commentId ? { ...c, comment: editedComment } : c
            ));
            setEditingId(null);
            setEditedComment('');
        } catch {
            alert('שגיאה בעדכון תגובה');
        }
    };

    return (
        <div className={styles.pendingManager}>
            <h5>תגובות ממתינות לאישור</h5>
            <button onClick={onClose} className={styles.closeButton}>סגור</button>
            {loading ? (
                <p>טוען...</p>
            ) : pendingComments.length === 0 ? (
                <p>אין תגובות ממתינות.</p>
            ) : (
                <ul className={styles.commentList}>
                    {pendingComments.map(comment => (
                        <li key={comment.id} className={styles.commentItem}>
                            <div className={styles.commentHeader}>
                                <span className={styles.username}>{comment.username}</span>
                                <span className={styles.date}>
                                    {comment.created_at ? new Date(comment.created_at).toLocaleString() : ''}
                                </span>
                            </div>
                            {editingId === comment.id ? (
                                <>
                                    <textarea
                                        className={styles.textarea}
                                        value={editedComment}
                                        onChange={e => setEditedComment(e.target.value)}
                                    />
                                    <button onClick={() => handleSaveEdit(comment.id)}>שמור</button>
                                    <button onClick={() => setEditingId(null)}>בטל</button>
                                </>
                            ) : (
                                <p className={styles.commentText}>{comment.comment}</p>
                            )}
                            <button onClick={() => handleApprove(comment.id)} className={styles.approveButton}>אשר</button>
                            <button onClick={() => handleEdit(comment)} className={styles.editButton}>ערוך</button>
                            <button onClick={() => handleDelete(comment.id)} className={styles.deleteButton}>מחק</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PendingCommentsManager;
