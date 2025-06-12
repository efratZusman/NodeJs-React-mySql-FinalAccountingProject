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

    const loadUpdates = async () => {
        setLoading(true);
        try {
            const data = await apiService.get('/updates');
           console.log(data);
           console.log();
           
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
            console.log('Subscriptions response:', data);

            setUpdateSubscriptions(data);
        } catch (error) {
            console.error('Failed to load update subsriptions', error);
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
            await apiService.post('/users/subscribe-updates');
            alert('הרשמת לעדכונים בוצעה בהצלחה');
            fetchUser();
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

    const handleSaveEdit = async (id, updatedData) => {
        try {
            const updated = await apiService.put(`/updates/${id}`, updatedData);
            setUpdates(updates.map(u => (u.id === id ? updated : u)));
        } catch (error) {
            alert('עדכון נכשל');
        }
    };

    if (!isInitialized) return <p className={styles.loading}>טוען...</p>;

    return (
        <>
            <Navbar />

            <div className={styles.container}>
                <h2 className={styles.title}>עדכונים אחרונים</h2>

                {loading ? (
                    <p className={styles.loading}>טוען עדכונים...</p>
                ) : updates.length === 0 ? (
                    <p className={styles.emptyMessage}>אין עדכונים להצגה</p>
                ) : (
                    updates.map(update => (
                        
                        <UpdateItem
                            isSubscribedToUpdate={updateSubscriptions.find(u => u.update_id === update.id)}
                            user={user}
                            key={update.id}
                            update={update}
                            isAdmin={user?.role === 'admin'}
                            onDelete={handleDelete}
                            onSaveEdit={handleSaveEdit}
                        />
                    ))
                )}

                {user && !user.wants_updates && (
                    <button
                        className={styles.subscribeButton}
                        onClick={handleSubscribe}
                    >
                        הרשמה לעדכונים
                    </button>
                )}
            </div>
        </>
    );
};

export default Updates;
