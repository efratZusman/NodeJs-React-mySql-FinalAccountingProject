import React, { useEffect, useState } from 'react';
import { useUserContext } from './UserContext';
import ApiService from '../ApiService';
import UpdateItem from './UpdateItem';
import Navbar from './Navbar';
import styles from '../styles/Updates.module.css';

const apiService = new ApiService();

const Updates = () => {
    const { user, isInitialized, fetchUser } = useUserContext();
    const [updates, setUpdates] = useState([]);
    const [updateSubscriptions, setUpdateSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingNew, setAddingNew] = useState(false);

    const loadUpdates = async () => {
        setLoading(true);
        try {
            const data = await apiService.get('/updates');
            setUpdates(data);
        } catch (error) {
            console.error('Failed to load updates', error);
        } finally {
            setLoading(false);
        }
    };

    const loadUpdateSubscriptions = async () => {
        setLoading(true);
        try {
            const data = await apiService.get('/updates/subsriptions');
            setUpdateSubscriptions(data);
        } catch (error) {
            console.error('Failed to load update subscriptions', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUpdates();
        loadUpdateSubscriptions();
    }, []);

    const handleSubscribe = async () => {
        try {
            await apiService.patch('/users/subscribe-updates',{wants_updates: !user.wants_updates});
            alert('הרשמת לעדכונים בוצעה בהצלחה');
            await fetchUser();
        } catch (error) {
            alert('ההרשמה נכשלה');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('למחוק את העדכון?')) return;
        try {
            await apiService.delete(`/updates/${id}`);
            setUpdates(updates.filter(u => u.id !== id));
        } catch (error) {
            alert('מחיקה נכשלה');
        }
    };

    const handleSaveEdit = async (id, updatedData, isNew = false) => {
        try {
            let updated;
            if (isNew) {
                updated = await apiService.post('/updates', updatedData);
                setUpdates([updated, ...updates]);
                setAddingNew(false);
            } else {
                updated = await apiService.put(`/updates/${id}`, updatedData);
                setUpdates(updates.map(u => (u.id === id ? updated : u)));
            }
        } catch (error) {
            alert('עדכון נכשל');
        }
    };

    const handleAddNew = () => {
        setAddingNew(true);
    };

    const handleCancelNew = () => {
        setAddingNew(false);
    };

    if (!isInitialized) return <p className={styles.loading}>טוען...</p>;

    return (
        <>
            <Navbar />

            <div className={styles.container}>
                <h2 className={styles.title}>עדכונים אחרונים</h2>

                {user?.role === 'admin' && !addingNew && (
                    <button className={styles.addButton} onClick={handleAddNew}>
                        + הוסף עדכון חדש
                    </button>
                )}

                {addingNew && (
                    <UpdateItem
                        isAdmin={true}
                        user={user}
                        isNew={true}
                        onSaveEdit={handleSaveEdit}
                        onCancelNew={handleCancelNew}
                    />
                )}

                {loading ? (
                    <p className={styles.loading}>טוען עדכונים...</p>
                ) : updates.length === 0 ? (
                    <p className={styles.emptyMessage}>אין עדכונים להצגה</p>
                ) : (
                    updates.map(update => (
                        <UpdateItem
                            key={update.id}
                            update={update}
                            isAdmin={user?.role === 'admin'}
                            user={user}
                            isSubscribedToUpdate={updateSubscriptions.find(u => u.update_id === update.id)}
                            onDelete={handleDelete}
                            onSaveEdit={handleSaveEdit}
                        />
                    ))
                )}

                {user && user.role !== 'admin' && (
                    <button
                        className={styles.subscribeButton}
                        onClick={handleSubscribe}
                    >
                         {user.wants_updates ? 'ביטול הרשמה' : 'הרשמה לעדכונים'}
                    </button>
                )}
            </div>
        </>
    );
};

export default Updates;
