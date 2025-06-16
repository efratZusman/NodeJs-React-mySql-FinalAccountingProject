import React, { useState, useEffect } from "react";
import ApiService from "../ApiService";
import formStyles from "../styles/Form.module.css";

const apiService = new ApiService();

function ContactForm({ initialFullName = "", initialEmail = "", initialPhone = "", initialMessage = "", onSuccess }) {
    const [fullName, setFullName] = useState(initialFullName);
    const [email, setEmail] = useState(initialEmail);
    const [phone, setPhone] = useState(initialPhone);
    const [message, setMessage] = useState(initialMessage);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");
        setLoading(true);
        try {
            await apiService.post("/contact", { full_name: fullName, email, phone, message });
            setSuccess("Your message was sent successfully!");
            setMessage("");
            if (onSuccess) onSuccess();
        } catch (err) {
            setError("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setFullName(initialFullName);
        setEmail(initialEmail);
        setPhone(initialPhone);
        setMessage(initialMessage);
    }, [initialFullName, initialEmail, initialPhone, initialMessage]);

    return (
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
            <input
                className={formStyles.input}
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
    );
}

export default ContactForm;