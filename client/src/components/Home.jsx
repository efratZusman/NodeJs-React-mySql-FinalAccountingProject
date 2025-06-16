import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import logo from '../assets/images/logo.png';
import styles from '../styles/Home.module.css';
import Contact from "./Contact"; // ייבוא צור קשר

const routes = [
  {
    path: "/clients",
    title: "לקוחות",
    desc: "ניהול לקוחות, צפייה בפרטי לקוח, הוספה ועדכון לקוחות.",
  },
  {
    path: "/articles",
    title: "מאמרים",
    desc: "מאגר מאמרים מקצועיים, העלאת מאמרים חדשים ועריכתם.",
  },
  {
    path: "/newsletters",
    title: "ניוזלטרים",
    desc: "שליחת ניוזלטרים ועדכונים ללקוחות, צפייה בארכיון.",
  },
  {
    path: "/updates",
    title: "עדכונים",
    desc: "פרסום עדכונים חשובים ללקוחות ולעובדים.",
  }
];

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className={styles.homeContainer}>
        <img src={logo} alt="Logo" style={{ height: 80, margin: "32px auto" }} />
        <div className={styles.hero}>
          <h1>ברוכים הבאים למערכת רואת החשבון</h1>
          <p>
            מערכת ניהול מתקדמת ללקוחות, מאמרים, ניוזלטרים ועדכונים.<br />
            כאן תוכלו לנהל את כל המידע הפיננסי, התקשורת והעדכונים במקום אחד, בצורה מאובטחת, נוחה ומקצועית.
          </p>
        </div>
        <div className={styles.features}>
          {routes.map(route => (
            <div key={route.path} className={styles.featureCard}>
              <div className={styles.featureIcon}>📄</div>
              <h3>{route.title}</h3>
              <p>{route.desc}</p>
              <button
                className={styles.ctaButton}
                onClick={() => navigate(route.path)}
              >
                מעבר
              </button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 40, width: "100%" }}>
          <Contact />
        </div>
      </div>
    </>
  );
}

export default Home;