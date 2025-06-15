import React, { useState, useEffect } from "react";
import { useUserContext } from "./UserContext";
import ApiService from "../ApiService";
import styles from "../styles/Contact.module.css";
import Navbar from "./Navbar";

const apiService = new ApiService();

function Contact() {
    const { user } = useUserContext();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // <-- new

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
        setLoading(true); // <-- show loading
        try {
            await apiService.post("/contact", { full_name: fullName, email, message });
            setSuccess("Your message was sent successfully!");
            setMessage("");
        } catch (err) {
            setError("Failed to send message. Please try again.");
        } finally {
            setLoading(false); // <-- hide loading
        }
    };

    return (
        <>
        <Navbar />
        <div className={styles.container}>
            <h2>Contact Us</h2>
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
        </div>
        </>
    );
}

export default Contact;