import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import apiService from "../utils/ApiService";
import CommentsSection from "./CommentsSection";
import styles from "../styles/Information.module.css";
import PageNotFound from "./PageNotFound"; 

// const apiService = new ApiService();

function InformationArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [showCommentsFor, setShowCommentsFor] = useState(null);
  const [notFound, setNotFound] = useState(false); 

  useEffect(() => {
    async function fetchArticle() {
      try {
        const data = await apiService.get(`/information/${id}`);
        if (!data || !data.id) {
          setNotFound(true);
        } else {
          setArticle(data);
        }
      } catch {
        setNotFound(true);
      }
    }
    fetchArticle();
  }, [id]);

  if (notFound) {
    return <PageNotFound />;
  }

  if (!article) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <p>טוען מאמר...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <button
          className={styles.backButton}
          onClick={() => navigate("/articles")}
          style={{ marginBottom: 24 }}
        >
          ← חזרה לרשימת המאמרים
        </button>
        <div className={styles.header}>
          <h3>{article.title}</h3>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          <button
            className={styles.commentToggle}
            onClick={e => {
              e.stopPropagation();
              setShowCommentsFor(article.id === showCommentsFor ? null : article.id);
            }}
          >
            {showCommentsFor === article.id ? 'הסתר תגובות' : 'הצג תגובות'}
          </button>
          {showCommentsFor === article.id && (
            <div onClick={e => e.stopPropagation()}>
              <CommentsSection articleId={article.id} />
            </div>
          )}
   
        </div>
      </div>
    </>
  );
}

export default InformationArticlePage;