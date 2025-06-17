import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import logo from '../assets/images/logo.png';
import styles from '../styles/Home.module.css';
import Contact from "./Contact";

const routes = [
  {
    path: "/clients",
    title: "לקוחות",
    desc: "מידע חשוב ללקוחות קיימים ודרכי יצירת קשר.",
  },
  {
    path: "/articles",
    title: "מאמרים",
    desc: "מאמרים שכתבה נעמה זוסמן בנושאי חשבונאות, מס ועוד.",
  },
  {
    path: "/newsletters",
    title: "ניוזלטרים",
    desc: "ארכיון ניוזלטרים קודמים שנשלחו ללקוחות ולעוקבים.",
  },
  {
    path: "/updates",
    title: "עדכונים",
    desc: "התפתחויות חדשות, חדשות רגולטוריות ומידע חשוב.",
  }
];


function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className={styles.homeContainer}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <div className={styles.hero}>
          <p>
            כאן תוכלו למצוא מאמרים מקצועיים בנושאי מיסוי, פיננסים ועסקים,<br />
            לעיין בניוזלטרים קודמים, להתעדכן בהתפתחויות חשובות ולקבל מידע אמין וישיר מרואת חשבון מוסמכת.
          </p>
        </div>

        <div className={styles.features}>
          {routes.map(route => (
            <div key={route.path} className={styles.featureCard}>
              <div className={styles.featureIcon}>📄</div>
              <h3 className={styles.featureTitle}>{route.title}</h3>
              <p className={styles.featureDesc}>{route.desc}</p>
              <button
                className={styles.ctaButton}
                onClick={() => navigate(route.path)}
              >
                מעבר
              </button>
            </div>
          ))}
        </div>
        <div className={styles.contactContainer}>
          <Contact />
        </div>
      </div>
    </>
  );
}

export default Home;