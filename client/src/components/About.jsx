import React from "react";
import Navbar from "./Navbar";
import ContactForm from "./ContactForm";
import styles from "../styles/About.module.css";

function About() {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>אודות רו"ח נעמה זוסמן</h1>
        <p className={styles.description}>
          נעמה זוסמן, רואת חשבון מוסמכת ובעלת ניסיון של למעלה מ-15 שנה בתחום החשבונאות, המיסוי והייעוץ הפיננסי.
          נעמה מלווה עסקים, עמותות ויחידים במגוון תחומים, תוך דגש על יחס אישי, מקצועיות ושקיפות מלאה.
          <br /><br />
          נעמה מתמחה בליווי עמותות ומוסדות חינוך, ועובדת בשיתוף פעולה הדוק עם משרד החינוך, רשויות מקומיות וגורמים ציבוריים נוספים.
          היא מעניקה שירותי ביקורת, ייעוץ פיננסי, הכנת דוחות כספיים, טיפול בהגשת בקשות תמיכה, סיוע במכרזים, והדרכות מקצועיות לצוותי הנהלה וחשבונאות.
          <br /><br />
          בנוסף, נעמה מספקת שירותי ייעוץ מס, הנהלת חשבונות, חשבות שכר, והכנה לביקורות של רשויות המדינה.
          כל לקוח זוכה לליווי אישי, מקצועי ודיסקרטי, מתוך מחויבות אמיתית להצלחתו.
        </p>
      </div>
      <div className={styles.appointmentContainer}>
        <h2 className={styles.appointmentTitle}>לקביעת פגישה:</h2>
        <ContactForm initialMessage="קביעת פגישה - " />
      </div>
    </>
  );
}

export default About;