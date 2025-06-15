import React, { useState, useEffect } from 'react';
import ApiService from '../ApiService';
import { useUserContext } from './UserContext';
import Navbar from './Navbar';
import styles from '../styles/Newsletters.module.css';

const apiService = new ApiService();

const Newsletters = () => {
    const { user, isInitialized } = useUserContext();
    const [newsletters, setNewsletters] = useState([]);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [htmlFile, setHtmlFile] = useState(null);

    const fetchNewsletters = async () => {
        try {
            const data = await apiService.get('/newsletters');
            setNewsletters(data);
        } catch {
            alert('שגיאה בטעינת ניוזלטרים');
        }
    };

    useEffect(() => {
        fetchNewsletters();
    }, []);

    // העלאת קובץ HTML בלבד להוספת ניוזלטר
    const handleUploadHtml = async () => {
        if (!htmlFile || !title || !date) {
            alert('נא לבחור קובץ HTML ולמלא כותרת ותאריך');
            return;
        }

        const formData = new FormData();
        formData.append('file', htmlFile);
        formData.append('title', title);
        formData.append('date', date);

        try {
            await apiService.uploadFile('/newsletters/upload-html', formData);
            setTitle('');
            setDate('');
            setHtmlFile(null);
            fetchNewsletters();
        } catch {
            alert('שגיאה בהעלאת קובץ HTML');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('למחוק את הניוזלטר?')) return;
        try {
            await apiService.delete(`/newsletters/${id}`);
            setNewsletters(newsletters.filter((n) => n.id !== id));
        } catch {
            alert('שגיאה במחיקה');
        }
    };

    const handleHtmlChange = (e) => {
        setHtmlFile(e.target.files[0]);
    };

    if (!isInitialized) return <p className={styles.loading}>טוען...</p>;

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <h2 className={styles.title}>ניוזלטרים</h2>

                {/* רק למנהל: טופס להעלאת HTML */}
                {user?.role === 'admin' && (
                    <div className={styles.form}>
                        <input
                            type="text"
                            placeholder="כותרת"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={styles.input}
                        />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={styles.input}
                        />

                        <label>העלאת קובץ HTML:</label>
                        <input type="file" accept=".html" onChange={handleHtmlChange} />
                        <button onClick={handleUploadHtml} className={styles.addButton}>
                            העלה HTML ושמור
                        </button>
                    </div>
                )}

                {newsletters.length === 0 ? (
                    <p className={styles.empty}>אין ניוזלטרים להצגה</p>
                ) : (
                    newsletters.map((nl) => (
                        <div key={nl.id} className={styles.newsletter}>
                            <div
                                className={styles.header}
                                onClick={() =>
                                    setExpandedId(nl.id === expandedId ? null : nl.id)
                                }
                            >
                                <strong>{nl.title}</strong> -{' '}
                                <em>{new Date(nl.date).toLocaleDateString('he-IL')}</em>
                            </div>
                            {expandedId === nl.id && nl.filePath && (
                                <iframe
                                    src={`${nl.filePath}`}
                                    title={nl.title}
                                    className={styles.iframe}
                                    style={{ width: '100%', height: '400px', border: 'none' }}
                                />
                            )}

                            {/* רק מנהל יכול למחוק */}
                            {user?.role === 'admin' && (
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDelete(nl.id)}
                                >
                                    מחק
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default Newsletters;
