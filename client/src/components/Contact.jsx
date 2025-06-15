import React, { useState, useEffect } from "react";
import { useUserContext } from "./UserContext";
import ApiService from "../ApiService";
import styles from "../styles/Contact.module.css";
import Navbar from "./Navbar";

const apiService = new ApiService();

const WHATSAPP_NUMBER = "972501234567"; // עדכן למספר שלך
const PHONE_NUMBER = "0501234567";
const ADMIN_EMAIL = "admin@gmail.com";

function Contact() {
    const { user } = useUserContext();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
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
            await apiService.post("/contact", { full_name: fullName, email, message });
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
            <div className={styles.container}>
                <h2>Contact Us</h2>
                {!showForm ? (
                    <div className={styles.options}>
                        <a
                            href={`https://wa.me/${WHATSAPP_NUMBER}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.contactCard}
                            tabIndex={0}
                        >
                            <span className={styles.contactIcon}>💬</span>
                            <span className={styles.contactLabel}>WhatsApp</span>
                            <span className={styles.contactValue}>{PHONE_NUMBER}</span>
                        </a>
                        <a
                            href={`tel:${PHONE_NUMBER}`}
                            className={styles.contactCard}
                            tabIndex={0}
                        >
                            <span className={styles.contactIcon}>📞</span>
                            <span className={styles.contactLabel}>Phone</span>
                            <span className={styles.contactValue}>{PHONE_NUMBER}</span>
                        </a>
                        <button
                            className={styles.contactCard}
                            style={{ background: "linear-gradient(135deg, #388e3c 70%, #81c784 100%)" }}
                            onClick={() => setShowForm(true)}
                            tabIndex={0}
                        >
                            <span className={styles.contactIcon}>✉️</span>
                            <span className={styles.contactLabel}>Email</span>
                            <span className={styles.contactValue}>{ADMIN_EMAIL}</span>
                        </button>
                    </div>
                ) : (
                    <>
                        <button
                            className={styles.option}
                            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", marginBottom: "10px" }}
                            onClick={() => setShowForm(false)}
                        >
                            ← Back to contact options
                        </button>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <textarea
                                placeholder="Your message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? "Sending..." : "Send"}
                            </button>
                            {loading && <div className={styles.loading}>Sending your message...</div>}
                            {success && <div className={styles.success}>{success}</div>}
                            {error && <div className={styles.error}>{error}</div>}
                        </form>
                    </>
                )}
            </div>
        </>
    );
}

export default Contact;