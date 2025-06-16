// import React, { useState, useEffect, useRef } from 'react';
// import { useUserContext } from './UserContext';
// import ApiService from '../ApiService';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import styles from '../styles/Information.module.css';
// import Navbar from './Navbar';

// const apiService = new ApiService();

// const modules = {
//     toolbar: [
//         [{ font: [] }, { size: [] }],
//         [{ header: [1, 2, 3, false] }],
//         [{ align: [] }],
//         ['bold', 'italic', 'underline', 'strike'],
//         [{ color: [] }, { background: [] }],
//         [{ list: 'ordered' }, { list: 'bullet' }],
//         ['link', 'image'],
//         ['clean'],
//     ],
// };

// const formats = [
//     'header', 'font', 'size',
//     'bold', 'italic', 'underline', 'strike',
//     'color', 'background',
//     'list', 'bullet',
//     'align',
//     'link', 'image'
// ];

// function InformationList() {
//     const { user } = useUserContext();
//     const [articles, setArticles] = useState([]);
//     const [expandedId, setExpandedId] = useState(null);
//     const [editingId, setEditingId] = useState(null);
//     const [formData, setFormData] = useState({ title: '', content: '' });
//     const [addingNew, setAddingNew] = useState(false);
//     const [showAddOptions, setShowAddOptions] = useState(false);
//     const [showEditor, setShowEditor] = useState(false);
//     const [showFileUpload, setShowFileUpload] = useState(false);
//     const [uploading, setUploading] = useState(false);
//     const [uploadTitle, setUploadTitle] = useState("");
//     const fileInputRef = useRef();

//     useEffect(() => {
//         loadArticles();
//     }, []);

//     const loadArticles = async () => {
//         try {
//             const data = await apiService.get('/information');
//             setArticles(data);
//         } catch (error) {
//             console.error('Failed to load articles', error);
//         }
//     };

//     const handleExpand = async (id) => {
//         if (expandedId === id) {
//             setExpandedId(null);
//             return;
//         }

//         try {
//             const data = await apiService.get(`/information/${id}`);
//             setArticles((prev) =>
//                 prev.map((a) => (a.id === id ? { ...a, content: data.content } : a))
//             );
//             setExpandedId(id);
//         } catch (error) {
//             console.error('Failed to fetch content', error);
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm('למחוק את המידע?')) return;
//         try {
//             await apiService.delete(`/information/${id}`);
//             setArticles(articles.filter((a) => a.id !== id));
//         } catch (error) {
//             alert('מחיקה נכשלה');
//         }
//     };

//     const handleSave = async () => {
//         const { title, content } = formData;

//         if (!title || !content) {
//             alert('יש למלא כותרת ותוכן');
//             return;
//         }

//         try {
//             if (editingId) {
//                 const updated = await apiService.put(`/information/${editingId}`, {
//                     title,
//                     content,
//                 });
//                 setArticles(articles.map((a) => (a.id === editingId ? updated : a)));
//             } else {
//                 const created = await apiService.post('/information', {
//                     title,
//                     content,
//                 });
//                 setArticles([created, ...articles]);
//             }

//             resetForm();
//         } catch (error) {
//             alert('שמירה נכשלה');
//         }
//     };

//     const resetForm = () => {
//         setFormData({ title: '', content: '' });
//         setEditingId(null);
//         setAddingNew(false);
//         setExpandedId(null);
//         setShowEditor(false);
//     };

//     const handleEdit = (article) => {
//         setFormData({ title: article.title, content: article.content || '' });
//         setEditingId(article.id);
//         setExpandedId(article.id);
//     };

//     const handleAddNewClick = () => {
//         setShowAddOptions(true);
//         setShowEditor(false);
//         setShowFileUpload(false);
//     };

//     const handleOpenEditor = () => {
//         setShowEditor(true);
//         setShowFileUpload(false);
//     };

//     const handleOpenFileUpload = () => {
//         setShowFileUpload(true);
//         setShowEditor(false);
//     };

//     const handleFileChange = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;
//         if (!uploadTitle) {
//             alert("יש להזין כותרת למאמר");
//             return;
//         }
//         setUploading(true);
//         try {
//             const formData = new FormData();
//             formData.append("file", file);
//             formData.append("title", uploadTitle); // הוספת הכותרת

//             const response = await apiService.uploadFile("/information/upload-file", formData);
//             setArticles([response, ...articles]);
//             setShowAddOptions(false);
//             setShowFileUpload(false);
//             setUploadTitle(""); // איפוס הכותרת
//         } catch (err) {
//             alert("שגיאה בהעלאת קובץ");
//         } finally {
//             setUploading(false);
//         }
//     };

//     return (
//         <>
//             <Navbar />
//             <div className={styles.container}>
//                 <h2 className={styles.title}>מידע מקצועי</h2>

//                 {user?.role === 'admin' && !showAddOptions && (
//                     <button className={styles.addButton} onClick={handleAddNewClick}>
//                         + הוסף מידע חדש
//                     </button>
//                 )}

//                 {showAddOptions && (
//                     <div style={{ display: "flex", gap: "16px", margin: "16px 0" }}>
//                         <button className={styles.addButton} onClick={handleOpenFileUpload}>
//                             העלאת קובץ מוכן
//                         </button>
//                         <button className={styles.addButton} onClick={handleOpenEditor}>
//                             פתיחת עריכת טקסט
//                         </button>
//                         <button className={styles.cancelButton} onClick={() => setShowAddOptions(false)}>
//                             ביטול
//                         </button>
//                     </div>
//                 )}

//                 {showFileUpload && (
//                     <div style={{ margin: "16px 0" }}>
//                         <input
//                             type="text"
//                             placeholder="כותרת למאמר"
//                             value={uploadTitle}
//                             onChange={e => setUploadTitle(e.target.value)}
//                             className={styles.input}
//                             style={{ marginBottom: 8 }}
//                         />
//                         <input
//                             type="file"
//                             accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
//                             ref={fileInputRef}
//                             onChange={handleFileChange}
//                             disabled={uploading}
//                         />
//                         {uploading && <span>מעלה קובץ...</span>}
//                     </div>
//                 )}

//                 {(showEditor || editingId) && (
//                     <div className={styles.editor}>
//                         <input
//                             type="text"
//                             placeholder="כותרת"
//                             value={formData.title}
//                             onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                             className={styles.input}
//                         />
//                         <ReactQuill
//                             theme="snow"
//                             value={formData.content}
//                             onChange={(content) => setFormData({ ...formData, content })}
//                             modules={modules}
//                             formats={formats}
//                             className={styles.quill}
//                         />
//                         <div className={styles.buttons}>
//                             <button className={styles.saveButton} onClick={handleSave}>שמור</button>
//                             <button className={styles.cancelButton} onClick={resetForm}>ביטול</button>
//                         </div>
//                     </div>
//                 )}

//                 <ul className={styles.list}>
//                     {articles.map((article) => (
//                         <li key={article.id} className={styles.item}>
//                             <div className={styles.header} onClick={() => handleExpand(article.id)}>
//                                 <h3>{article.title}</h3>
//                                 {expandedId !== article.id && (
//                                     <div
//                                         className={styles.excerpt}
//                                         dangerouslySetInnerHTML={{ __html: article.excerpt }}
//                                     />
//                                 )}
//                             </div>

//                             {expandedId === article.id && (
//                                 <div className={styles.content} dangerouslySetInnerHTML={{ __html: article.content }} />
//                             )}

//                             {user?.role === 'admin' && (
//                                 <div className={styles.adminControls}>
//                                     <button onClick={() => handleEdit(article)}>ערוך</button>
//                                     <button onClick={() => handleDelete(article.id)}>מחק</button>
//                                 </div>
//                             )}
//                         </li>
//                     ))}
//                 </ul>

//             </div>
//         </>
//     );
// };

// export default InformationList;
import React, { useState, useEffect, useRef } from 'react';
import { useUserContext } from './UserContext';
import ApiService from '../ApiService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CommentsSection from './CommentsSection';
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

function InformationList() {
    const [showCommentsFor, setShowCommentsFor] = useState(null);
    const { user } = useUserContext();
    const [articles, setArticles] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ title: '', content: '' });
    const [addingNew, setAddingNew] = useState(false);
    const [showAddOptions, setShowAddOptions] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadTitle, setUploadTitle] = useState("");
    const fileInputRef = useRef();

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
        setShowEditor(false);
    };

    const handleEdit = (article) => {
        setFormData({ title: article.title, content: article.content || '' });
        setEditingId(article.id);
        setExpandedId(article.id);
    };

    const handleAddNewClick = () => {
        setShowAddOptions(true);
        setShowEditor(false);
        setShowFileUpload(false);
    };

    const handleOpenEditor = () => {
        setShowEditor(true);
        setShowFileUpload(false);
    };

    const handleOpenFileUpload = () => {
        setShowFileUpload(true);
        setShowEditor(false);
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
            formData.append("title", uploadTitle); // הוספת הכותרת

            const response = await apiService.uploadFile("/information/upload-file", formData);
            setArticles([response, ...articles]);
            setShowAddOptions(false);
            setShowFileUpload(false);
            setUploadTitle(""); // איפוס הכותרת
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

                {user?.role === 'admin' && !showAddOptions && (
                    <button className={styles.addButton} onClick={handleAddNewClick}>
                        + הוסף מידע חדש
                    </button>
                )}

                {showAddOptions && (
                    <div style={{ display: "flex", gap: "16px", margin: "16px 0" }}>
                        <button className={styles.addButton} onClick={handleOpenFileUpload}>
                            העלאת קובץ מוכן
                        </button>
                        <button className={styles.addButton} onClick={handleOpenEditor}>
                            פתיחת עריכת טקסט
                        </button>
                        <button className={styles.cancelButton} onClick={() => setShowAddOptions(false)}>
                            ביטול
                        </button>
                    </div>
                )}

                {showFileUpload && (
                    <div style={{ margin: "16px 0" }}>
                        <input
                            type="text"
                            placeholder="כותרת למאמר"
                            value={uploadTitle}
                            onChange={e => setUploadTitle(e.target.value)}
                            className={styles.input}
                            style={{ marginBottom: 8 }}
                        />
                        <input
                            type="file"
                            accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                        {uploading && <span>מעלה קובץ...</span>}
                    </div>
                )}

                {(showEditor || editingId) && (
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
                                                e.stopPropagation(); // מונע סגירה של המאמר
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
};

export default InformationList;