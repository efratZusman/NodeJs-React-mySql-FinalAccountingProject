import React, { useState, useEffect } from "react";
import { useUserContext } from "./UserContext";
import ApiService from "../ApiService";
import formStyles from "../styles/Form.module.css";
import Navbar from "./Navbar";
import logo from '../assets/images/logo.png';

const apiService = new ApiService();

const WHATSAPP_NUMBER = "972501234567";
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
            <div className={formStyles.formContainer}>
                <img src={logo} alt="Logo" style={{ height: 60, marginBottom: 16 }} />
                <div className={formStyles.formTitle}>Contact Us</div>
                {!showForm ? (
                    <div style={{ display: "flex", gap: "24px", justifyContent: "center", marginBottom: "32px" }}>
                        <a
                            href={`https://wa.me/${WHATSAPP_NUMBER}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                background: "linear-gradient(135deg, #223a5e 70%, #b0b4b9 100%)",
                                color: "#fff",
                                borderRadius: "18px",
                                boxShadow: "0 4px 16px #223a5e22",
                                padding: "32px 24px",
                                minWidth: "160px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                cursor: "pointer",
                                fontSize: "1.1rem",
                                border: "none",
                                outline: "none",
                                textDecoration: "none",
                                position: "relative"
                            }}
                        >
                            <span style={{ fontSize: "2.5rem", marginBottom: "12px" }}>💬</span>
                            <span style={{ fontWeight: "bold", marginBottom: "4px", fontSize: "1.15rem" }}>WhatsApp</span>
                            <span style={{ fontSize: "1rem", opacity: 0.9 }}>{PHONE_NUMBER}</span>
                        </a>
                        <a
                            href={`tel:${PHONE_NUMBER}`}
                            style={{
                                background: "linear-gradient(135deg, #223a5e 70%, #b0b4b9 100%)",
                                color: "#fff",
                                borderRadius: "18px",
                                boxShadow: "0 4px 16px #223a5e22",
                                padding: "32px 24px",
                                minWidth: "160px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                cursor: "pointer",
                                fontSize: "1.1rem",
                                border: "none",
                                outline: "none",
                                textDecoration: "none",
                                position: "relative"
                            }}
                        >
                            <span style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📞</span>
                            <span style={{ fontWeight: "bold", marginBottom: "4px", fontSize: "1.15rem" }}>Phone</span>
                            <span style={{ fontSize: "1rem", opacity: 0.9 }}>{PHONE_NUMBER}</span>
                        </a>
                        <button
                            style={{
                                background: "linear-gradient(135deg, #274472 70%, #b0b4b9 100%)",
                                color: "#fff",
                                borderRadius: "18px",
                                boxShadow: "0 4px 16px #223a5e22",
                                padding: "32px 24px",
                                minWidth: "160px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                cursor: "pointer",
                                fontSize: "1.1rem",
                                border: "none",
                                outline: "none",
                                textDecoration: "none",
                                position: "relative"
                            }}
                            onClick={() => setShowForm(true)}
                        >
                            <span style={{ fontSize: "2.5rem", marginBottom: "12px" }}>✉️</span>
                            <span style={{ fontWeight: "bold", marginBottom: "4px", fontSize: "1.15rem" }}>Email</span>
                            <span style={{ fontSize: "1rem", opacity: 0.9 }}>{ADMIN_EMAIL}</span>
                        </button>
                    </div>
                ) : (
                    <div>
                        <button
                            style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                                marginBottom: "10px",
                                color: "#223a5e",
                                fontWeight: "bold"
                            }}
                            onClick={() => setShowForm(false)}
                        >
                            ← Back to contact options
                        </button>
                        <form onSubmit={handleSubmit} className={formStyles.form}>
                            <input
                                className={formStyles.input}
                                type="text"
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                            <input
                                className={formStyles.input}
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <textarea
                                className={formStyles.input}
                                placeholder="Your message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                            <button className={formStyles.button} type="submit" disabled={loading}>
                                {loading ? "Sending..." : "Send"}
                            </button>
                            {loading && <div className={formStyles.success}>Sending your message...</div>}
                            {success && <div className={formStyles.success}>{success}</div>}
                            {error && <div className={formStyles.error}>{error}</div>}
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}

export default Contact;