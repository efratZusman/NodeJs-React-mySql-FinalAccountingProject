import React, { useState } from 'react';
import styles from '../styles/UpdateItem.module.css';
import ApiService from '../ApiService';

const apiService = new ApiService();

const toDateInputValue = (dateStr) => {
    const local = new Date(dateStr);
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return local.toISOString().split('T')[0];
};

const UpdateItem = ({
    update = {},
    isAdmin,
    onDelete,
    onSaveEdit,
    user,
    isSubscribedToUpdate,
    isNew = false,
    onCancelNew,
}) => {
    const [isEditing, setIsEditing] = useState(isNew);
    const [isSubscribed, setIsSubscribed] = useState(isSubscribedToUpdate);
    const [editData, setEditData] = useState({
        date: toDateInputValue(update.date || new Date()),
        title: update.title || '',
        content: update.content || '',
    });

    const handleSave = () => {
        onSaveEdit(update.id, editData, isNew);
        if (!isNew) setIsEditing(false);
    };

    const handleSubscribeSpecific = async () => {
        try {
            if (isSubscribed) {
                await apiService.delete(`/updates/unsubscribe/${isSubscribed.id}`);
                setIsSubscribed(null);
            } else {
                const data = await apiService.post('/updates/subscribe', { update_id: update.id });
                setIsSubscribed(data);
            }
        } catch (error) {
            console.error('Error toggling subscription:', error.message);
        }
    };

    return (
        <div className={styles.container}>
            {!isEditing ? (
                <>
                    <h3 className={styles.title}>{update.title}</h3>
                    <small className={styles.date}>
                        {new Date(update.date).toLocaleDateString('he-IL')}
                    </small>
                    <p className={styles.content}>{update.content}</p>

                    {user && !user.wants_updates && !isAdmin && (
                        <button
                            className={styles.buttonGroup}
                            onClick={handleSubscribeSpecific}
                        >
                            {isSubscribed ? 'ביטול הרשמה' : 'הרשמה לעדכון'}
                        </button>
                    )}

                    {isAdmin && (
                        <div className={styles.buttonGroup}>
                            <button
                                className={styles.button}
                                onClick={() => setIsEditing(true)}
                            >
                                ערוך
                            </button>
                            <button
                                className={styles.button}
                                onClick={() => onDelete(update.id)}
                            >
                                מחק
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div>
                    <input
                        type="date"
                        className={styles.input}
                        value={editData.date}
                        onChange={e => setEditData({ ...editData, date: e.target.value })}
                    />
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="כותרת"
                        value={editData.title}
                        onChange={e => setEditData({ ...editData, title: e.target.value })}
                    />
                    <textarea
                        className={styles.textarea}
                        placeholder="תוכן"
                        value={editData.content}
                        onChange={e => setEditData({ ...editData, content: e.target.value })}
                    />
                    <div className={styles.buttonGroup}>
                        <button className={styles.button} onClick={handleSave}>
                            שמור
                        </button>
                        <button
                            className={styles.button}
                            onClick={() => isNew ? onCancelNew() : setIsEditing(false)}
                        >
                            בטל
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateItem;
