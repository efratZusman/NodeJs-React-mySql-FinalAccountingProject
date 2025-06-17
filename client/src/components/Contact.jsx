import  { useState, useEffect } from "react";
import { useUserContext } from "./UserContext";
import ApiService from "../utils/ApiService";
import styles from "../styles/Contact.module.css";
import Navbar from "./Navbar";
import logo from '../assets/images/logo.png';
import ContactForm from "./ContactForm";

const apiService = new ApiService();

const WHATSAPP_NUMBER = "972501234567";
const PHONE_NUMBER = "0501234567";
const ADMIN_EMAIL = "mh0583278625@gmail.com";

function Contact() {
    const { user } = useUserContext();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [phone, setPhone] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (user) {
            setFullName(user.full_name || "");
            setEmail(user.email || "");
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");
        setLoading(true);
        try {
            await apiService.post("/contact", { full_name: fullName, email, phone, message });
            setSuccess("Your message was sent successfully!");
            setMessage("");
        } catch (err) {
            setError("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className={styles.form}>
                <img src={logo} alt="Logo" className={styles.contactLogo} />
                <div className={styles.formTitle}>Contact Us</div>
                {!showForm ? (
                    <div className={styles.contactOptions}>
                        <a
                            href={`https://wa.me/${WHATSAPP_NUMBER}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.contactButton}
                        >
                            <span className={styles.contactIcon}>💬</span>
                            <span className={styles.contactTitle}>WhatsApp</span>
                            <span className={styles.contactValue}>{PHONE_NUMBER}</span>
                        </a>
                        <a
                            href={`tel:${PHONE_NUMBER}`}
                            className={styles.contactButton}
                        >
                            <span className={styles.contactIcon}>📞</span>
                            <span className={styles.contactTitle}>פלאפון</span>
                            <span className={styles.contactValue}>{PHONE_NUMBER}</span>
                        </a>
                        <a
                            href="#"
                            className={styles.contactButton}
                            onClick={e => {
                                e.preventDefault();
                                setShowForm(true);
                            }}
                            tabIndex={0}
                            role="button"
                        >
                            <span className={styles.contactIcon}>✉️</span>
                            <span className={styles.contactTitle}>מייל</span>
                            <span className={styles.contactValue}>{ADMIN_EMAIL}</span>
                        </a>
                    </div>
                ) : (
                    <div>
                        <button
                            className={styles.backButton}
                            onClick={() => setShowForm(false)}
                        >
                            ← Back to contact options
                        </button>
                        <ContactForm
                            initialFullName={fullName}
                            initialEmail={email}
                            initialPhone={phone}
                            initialMessage={message}
                        />
                        {error && <div className="error">{error}</div>}
                        {success && <div className="success">{success}</div>}
                    </div>
                )}
            </div>
        </>
    );
}

export default Contact;