import React, { useState, useEffect, useRef } from 'react';
import { useUserContext } from './UserContext';
import ApiService from '../ApiService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CommentsSection from './CommentsSection';
import styles from '../styles/Information.module.css';
import Navbar from './Navbar';
import PendingCommentsManager from './PendingCommentsManager';

const apiService = new ApiService();

const modules = {
    toolbar: [
        [{ font: [] }, { size: [] }],
        [{ header: [1, 2, 3, false] }],
        [{ align: [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
    ],
};

const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link', 'image'
];

function InformationList() {
    const [showCommentsFor, setShowCommentsFor] = useState(null);
    const { user } = useUserContext();
    const [articles, setArticles] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ title: '', content: '' });
    const [showEditor, setShowEditor] = useState(false);
    const [showAddOptions, setShowAddOptions] = useState(false);
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadTitle, setUploadTitle] = useState("");
    const [showManage, setShowManage] = useState(false);
    const fileInputRef = useRef();

    useEffect(() => {
        loadArticles();
    }, []);

    useEffect(() => {
        document.body.style.overflow = (showEditor || editingId) ? 'hidden' : 'auto';
    }, [showEditor, editingId]);

    const loadArticles = async () => {
        try {
            const data = await apiService.get('/information');
            setArticles(data);
        } catch (error) {
            console.error('Failed to load articles', error);
        }
    };

    const handleExpand = async (id) => {
        if (expandedId === id) {
            setExpandedId(null);
            return;
        }

        const article = articles.find((a) => a.id === id);
        if (article?.content) {
            setExpandedId(id);
            return;
        }

        try {
            const data = await apiService.get(`/information/${id}`);
            setArticles((prev) =>
                prev.map((a) => (a.id === id ? { ...a, content: data.content } : a))
            );
            setExpandedId(id);
        } catch (error) {
            console.error('Failed to fetch content', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('למחוק את המידע?')) return;
        try {
            await apiService.delete(`/information/${id}`);
            setArticles(articles.filter((a) => a.id !== id));
        } catch (error) {
            alert('מחיקה נכשלה');
        }
    };

    const handleSave = async () => {
        const { title, content } = formData;

        if (!title.trim() || !content.trim()) {
            alert('יש למלא כותרת ותוכן');
            return;
        }

        try {
            if (editingId) {
                const updated = await apiService.put(`/information/${editingId}`, {
                    title,
                    content,
                });
                setArticles(articles.map((a) => (a.id === editingId ? updated : a)));
            } else {
                const created = await apiService.post('/information', {
                    title,
                    content,
                });
                setArticles([created, ...articles]);
            }

            resetForm();
        } catch (error) {
            alert('שמירה נכשלה');
        }
    };

    const resetForm = () => {
        setFormData({ title: '', content: '' });
        setEditingId(null);
        setShowEditor(false);
        setShowAddOptions(false);
        setShowFileUpload(false);
        setUploadTitle('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleEdit = (article) => {
        setFormData({ title: article.title, content: article.content || '' });
        setEditingId(article.id);
        setExpandedId(article.id);
        setShowEditor(true);
    };

    const handleAddNewClick = () => {
        setShowEditor(true); // פותח את המודל
        setShowAddOptions(true); // מראה את האפשרויות בתוך המודל
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!uploadTitle) {
            alert("יש להזין כותרת למאמר");
            return;
        }
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("title", uploadTitle);

            const response = await apiService.uploadFile("/information/upload-file", formData);
            setArticles([response, ...articles]);
            resetForm();
        } catch (err) {
            alert("שגיאה בהעלאת קובץ");
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <h2 className={styles.title}>מידע מקצועי</h2>

                {user?.role === 'admin' && (
                    <button
                        className={styles.manageButton}
                        onClick={() => setShowManage(true)}
                    >
                        ניהול תגובות
                    </button>
                )}

                {showManage && user?.role === 'admin' && (
                    <PendingCommentsManager onClose={() => setShowManage(false)} />
                )}

                {user?.role === 'admin' && (
                    <div className={styles.buttonsContainer}>
                        <button className={styles.addButton} onClick={handleAddNewClick}>
                            + הוסף מידע חדש
                        </button>
                    </div>
                )}

                {(showEditor || editingId) && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            {showAddOptions && !editingId && (
                                <>
                                    <h3 className={styles.modalTitle}>בחר דרך הוספה</h3>
                                    <div className={styles.modalOptions}>
                                        <button
                                            className={styles.addButton}
                                            onClick={() => {
                                                setShowFileUpload(true);
                                                setShowAddOptions(false);
                                            }}
                                        >
                                            העלאת קובץ מוכן
                                        </button>
                                        <button
                                            className={styles.addButton}
                                            onClick={() => {
                                                setShowFileUpload(false);
                                                setShowAddOptions(false);
                                            }}
                                        >
                                            פתיחת עורך טקסט
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* עורך טקסט */}
                            {!showAddOptions && !showFileUpload && (
                                <>
                                    <input
                                        type="text"
                                        placeholder="כותרת"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className={styles.input}
                                    />
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content}
                                        onChange={(content) => setFormData({ ...formData, content })}
                                        modules={modules}
                                        formats={formats}
                                        className={styles.quill}
                                    />
                                </>
                            )}

                            {/* העלאת קובץ */}
                            {!showAddOptions && showFileUpload && (
                                <>
                                    <input
                                        type="text"
                                        placeholder="כותרת למאמר"
                                        value={uploadTitle}
                                        onChange={e => setUploadTitle(e.target.value)}
                                        className={styles.input}
                                    />
                                    <input
                                        type="file"
                                        accept=".doc,.docx,.pdf"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        disabled={uploading}
                                    />
                                    {uploading && <span className={styles.uploadingText}>מעלה קובץ...</span>}
                                </>
                            )}

                            {/* כפתורי שמירה וביטול */}
                            {!showAddOptions && (
                                <div className={styles.modalButtons}>
                                    <button className={styles.saveButton} onClick={handleSave}>שמור</button>
                                    <button className={styles.cancelButton} onClick={resetForm}>ביטול</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <ul className={styles.list}>
                    {articles.map((article) => (
                        <li key={article.id} className={styles.item}>
                            <div className={styles.header} onClick={() => handleExpand(article.id)}>
                                <h3>{article.title}</h3>
                                {expandedId !== article.id && (
                                    <div
                                        className={styles.excerpt}
                                        dangerouslySetInnerHTML={{ __html: article.excerpt }}
                                    />
                                )}
                                {expandedId === article.id && (
                                    <>
                                        <div
                                            className={styles.content}
                                            onClick={() => handleExpand(article.id)}
                                            dangerouslySetInnerHTML={{ __html: article.content }}
                                        />
                                        <button
                                            className={styles.commentToggle}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowCommentsFor(article.id === showCommentsFor ? null : article.id);
                                            }}
                                        >
                                            {showCommentsFor === article.id ? 'הסתר תגובות' : 'הצג תגובות'}
                                        </button>
                                        {showCommentsFor === article.id && (
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <CommentsSection articleId={article.id} />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {user?.role === 'admin' && (
                                <div className={styles.adminControls}>
                                    <button onClick={() => handleEdit(article)}>ערוך</button>
                                    <button onClick={() => handleDelete(article.id)}>מחק</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default InformationList;
