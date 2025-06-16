import React, { useState, useEffect } from 'react';
import { useUserContext } from './UserContext';
import ApiService from '../ApiService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from '../styles/Information.module.css';
import Navbar from './Navbar';

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

const InformationList = () => {
    const { user } = useUserContext();
    const [articles, setArticles] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ title: '', content: '' });
    const [addingNew, setAddingNew] = useState(false);

    useEffect(() => {
        loadArticles();
    }, []);

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

        if (!title || !content) {
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
        setAddingNew(false);
        setExpandedId(null);
    };

    const handleEdit = (article) => {
        setFormData({ title: article.title, content: article.content || '' });
        setEditingId(article.id);
        setExpandedId(article.id);
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <h2 className={styles.title}>מידע מקצועי</h2>

                {user?.role === 'admin' && !addingNew && !editingId && (
                    <button className={styles.addButton} onClick={() => setAddingNew(true)}>
                        + הוסף מידע חדש
                    </button>
                )}

                {(addingNew || editingId) && (
                    <div className={styles.editor}>
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
                        <div className={styles.buttons}>
                            <button className={styles.saveButton} onClick={handleSave}>שמור</button>
                            <button className={styles.cancelButton} onClick={resetForm}>ביטול</button>
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
                            </div>

                            {expandedId === article.id && (
                                <div className={styles.content} dangerouslySetInnerHTML={{ __html: article.content }} />
                            )}

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
};

export default InformationList;
