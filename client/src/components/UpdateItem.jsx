import React, { useState } from 'react';
import styles from '../styles/UpdateItem.module.css';
import ApiService from '../ApiService';
import { 
    validateTitle, 
    validateDate, 
    validateTextLength,
    VALIDATION_MESSAGES 
} from '../utils/validation';

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
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        
        if (!validateDate(editData.date)) {
            newErrors.date = VALIDATION_MESSAGES.DATE;
        }
        
        if (!validateTitle(editData.title)) {
            newErrors.title = VALIDATION_MESSAGES.TITLE;
        }
        
        if (!validateTextLength(editData.content, 10, 5000)) {
            newErrors.content = 'התוכן חייב להכיל בין 10 ל-5000 תווים';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) {
            return;
        }
        
        onSaveEdit(update.id, editData, isNew);
        if (!isNew) setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // נקה שגיאה ספציפית כשהמשתמש מתחיל להקליד
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const getEarliestSubscribableDate = () => {
        const now = new Date();
        const tenAM = new Date(now);
        tenAM.setHours(10, 0, 0, 0);

        const baseDate = new Date(now);
        if (now < tenAM) {
            // לפני 10:00 – אפשר להרשם לעדכון של מחר
            baseDate.setDate(baseDate.getDate() + 1);
        } else {
            // אחרי 10:00 – אפשר להרשם רק לעדכון של עוד יומיים
            baseDate.setDate(baseDate.getDate() + 2);
        }
        baseDate.setHours(0, 0, 0, 0);
        return baseDate;
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

    if (isEditing) {
        return (
            <div className={styles.editContainer}>
                <div className={styles.formGroup}>
                    <label>תאריך:</label>
                    <input
                        type="date"
                        name="date"
                        className={`${styles.input} ${errors.date ? styles.inputError : ''}`}
                        value={editData.date}
                        onChange={handleChange}
                    />
                    {errors.date && <span className={styles.errorText}>{errors.date}</span>}
                </div>
                
                <div className={styles.formGroup}>
                    <label>כותרת:</label>
                    <input
                        type="text"
                        name="title"
                        className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                        placeholder="כותרת"
                        value={editData.title}
                        onChange={handleChange}
                    />
                    {errors.title && <span className={styles.errorText}>{errors.title}</span>}
                </div>
                
                <div className={styles.formGroup}>
                    <label>תוכן:</label>
                    <textarea
                        name="content"
                        className={`${styles.textarea} ${errors.content ? styles.inputError : ''}`}
                        placeholder="תוכן"
                        value={editData.content}
                        onChange={handleChange}
                        rows={6}
                    />
                    {errors.content && <span className={styles.errorText}>{errors.content}</span>}
                    <div className={styles.charCount}>
                        {editData.content.length}/5000 תווים
                    </div>
                </div>
                
                <div className={styles.buttonGroup}>
                    <button 
                        className={styles.saveButton} 
                        onClick={handleSave}
                        disabled={Object.values(errors).some(Boolean)}
                    >
                        שמור
                    </button>
                    <button 
                        className={styles.cancelButton}
                        onClick={() => isNew ? onCancelNew() : setIsEditing(false)}
                    >
                        ביטול
                    </button>
                </div>
            </div>
        );
    }

    
    // תצוגה רגילה (לא עריכה)
    return (
        <div className={styles.container}>
            <h3 className={styles.title}>{update.title}</h3>
            <small className={styles.date}>
                {new Date(update.date).toLocaleDateString('he-IL')}
            </small>
            <p className={styles.content}>{update.content}</p>

            {user && !user.wants_updates && !isAdmin && new Date(update.date) >= getEarliestSubscribableDate() && (
                <button
                    className={styles.subscribeButton}
                    onClick={handleSubscribeSpecific}
                >
                    {isSubscribed ? 'ביטול הרשמה' : 'הרשמה לעדכון'}
                </button>
            )}

            {isAdmin && (
                <div className={styles.adminControls}>
                    <button
                        className={styles.editButton}
                        onClick={() => setIsEditing(true)}
                    >
                        עריכה
                    </button>
                    <button
                        className={styles.deleteButton}
                        onClick={() => onDelete(update.id)}
                    >
                        מחיקה
                    </button>
                </div>
            )}
        </div>
    );
};

export default UpdateItem;
