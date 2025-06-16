import React from "react";
import Navbar from "./Navbar";
import ContactForm from "./ContactForm";

function About() {
  return (
    <>
      <Navbar />
      <div style={{
        maxWidth: 650,
        margin: "48px auto",
        padding: "32px 28px",
        background: "#f6fafd",
        borderRadius: 14,
        boxShadow: "0 4px 24px #223a5e22",
        direction: "rtl"
      }}>
        <h1 style={{ color: "#223a5e", fontWeight: "bold", fontSize: "2rem", marginBottom: 18 }}>אודות רו"ח נעמה זוסמן</h1>
        <p style={{ color: "#274472", fontSize: "1.1rem", lineHeight: 1.7 }}>
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
      <div style={{ marginTop: 40 }}>
        <h2 style={{ color: "#223a5e", fontWeight: "bold", fontSize: "1.2rem" }}>לקביעת פגישה:</h2>
        <ContactForm initialMessage="קביעת פגישה - " />
      </div>
    </>
  );
}

export default About;