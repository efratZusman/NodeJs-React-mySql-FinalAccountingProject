import  { useState, useEffect } from 'react';
import ApiService from "../utils/ApiService";
import { useUserContext } from './UserContext';
import Navbar from './Navbar';
import styles from '../styles/Newsletters.module.css';
import { validateTitle, validateDate, validateFileType } from '../utils/validation';

const apiService = new ApiService();

const Newsletters = () => {
    const { user, isInitialized } = useUserContext();
    const [newsletters, setNewsletters] = useState([]);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [htmlFile, setHtmlFile] = useState(null);
    const [error, setError] = useState(''); 

    const fetchNewsletters = async () => {
        try {
            const data = await apiService.get('/newsletters');
            setNewsletters(data);
            setError(''); 
        } catch {
            setError('שגיאה בטעינת ניוזלטרים');
        }
    };

    useEffect(() => {
        fetchNewsletters();
    }, []);

    const allowedNewsletterTypes = ['text/html'];

    const handleUploadHtml = async () => {
        if (!htmlFile || !validateTitle(title) || !validateDate(date)) {
            setError('נא לבחור קובץ HTML ולמלא כותרת ותאריך תקינים');
            return;
        }
        if (!validateFileType(htmlFile, allowedNewsletterTypes)) {
            setError('רק קובץ HTML מותר');
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
            setError(''); 
            fetchNewsletters();
        } catch {
            setError('שגיאה בהעלאת קובץ HTML');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('למחוק את הניוזלטר?')) return;
        try {
            await apiService.delete(`/newsletters/${id}`);
            setNewsletters(newsletters.filter((n) => n.id !== id));
            setError('');
        } catch {
            setError('שגיאה במחיקה');
        }
    };

    const handleHtmlChange = (e) => {
        setHtmlFile(e.target.files[0]);
    };

    if (!isInitialized) return <p className={styles.loading}>טוען...</p>;

    return (
        <>
            <Navbar />
            <div className={`${styles.newslettersContainer} ${styles.container}`}>
                <h2 className={styles.title}>ניוזלטרים</h2>

                {error && <div className={styles.error}>{error}</div>}

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
                                <strong>{nl.title}</strong> {' '}
                                <em>{new Date(nl.date).toLocaleDateString('he-IL')}</em>
                            </div>
                            {expandedId === nl.id && nl.filePath && (
                                <div className={styles.iframeContainer}>
                                    <iframe
                                        src={`${nl.filePath}`}
                                        title={nl.title}
                                        className={styles.iframe}
                                    />
                                </div>
                            )}

                         
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
