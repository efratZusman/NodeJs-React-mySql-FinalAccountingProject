import React, { useState, useEffect } from "react";
import ApiService from "../ApiService";
import formStyles from "../styles/Form.module.css";
import { 
    validateEmail, 
    validatePhone, 
    validateFullName, 
    validateTextLength,
    VALIDATION_MESSAGES 
} from '../utils/validation';

const apiService = new ApiService();

function ContactForm({ initialFullName = "", initialEmail = "", initialPhone = "", initialMessage = "", onSuccess }) {
    const [formData, setFormData] = useState({
        fullName: initialFullName,
        email: initialEmail,
        phone: initialPhone,
        message: initialMessage
    });
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // נקה שגיאה ספציפית כשהמשתמש מתחיל להקליד
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!validateFullName(formData.fullName)) {
            newErrors.fullName = VALIDATION_MESSAGES.FULL_NAME;
        }
        
        if (!validateEmail(formData.email)) {
            newErrors.email = VALIDATION_MESSAGES.EMAIL;
        }
        
        if (!validatePhone(formData.phone)) {
            newErrors.phone = VALIDATION_MESSAGES.PHONE;
        }
        
        if (!validateTextLength(formData.message, 10, 2000)) {
            newErrors.message = 'ההודעה חייבת להכיל בין 10 ל-2000 תווים';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await apiService.post("/contact", { 
                full_name: formData.fullName.trim(), 
                email: formData.email.trim(), 
                phone: formData.phone.trim(), 
                message: formData.message.trim() 
            });
            
            setSuccess("הודעתך נשלחה בהצלחה! ניצור איתך קשר בהקדם.");
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                message: ''
            });
            
            if (onSuccess) onSuccess();
        } catch (err) {
            setError("אירעה שגיאה בשליחת ההודעה. אנא נסה שוב מאוחר יותר.");
            console.error('Error sending contact form:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setFormData({
            fullName: initialFullName,
            email: initialEmail,
            phone: initialPhone,
            message: initialMessage
        });
    }, [initialFullName, initialEmail, initialPhone, initialMessage]);

    return (
        <form onSubmit={handleSubmit} className={formStyles.form}>
            <div className={formStyles.formGroup}>
                <input
                    className={`${formStyles.input} ${errors.fullName ? formStyles.inputError : ''}`}
                    type="text"
                    name="fullName"
                    placeholder="שם מלא"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />
                {errors.fullName && <span className={formStyles.errorText}>{errors.fullName}</span>}
            </div>
            
            <div className={formStyles.formGroup}>
                <input
                    className={`${formStyles.input} ${errors.email ? formStyles.inputError : ''}`}
                    type="email"
                    name="email"
                    placeholder="אימייל"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                {errors.email && <span className={formStyles.errorText}>{errors.email}</span>}
            </div>
            
            <div className={formStyles.formGroup}>
                <input
                    className={`${formStyles.input} ${errors.phone ? formStyles.inputError : ''}`}
                    type="tel"
                    name="phone"
                    placeholder="טלפון"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
                {errors.phone && <span className={formStyles.errorText}>{errors.phone}</span>}
            </div>
            
            <div className={formStyles.formGroup}>
                <textarea
                    className={`${formStyles.textarea} ${errors.message ? formStyles.inputError : ''}`}
                    name="message"
                    placeholder="הודעתך"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    required
                />
                {errors.message && <span className={formStyles.errorText}>{errors.message}</span>}
                <div className={formStyles.charCount}>
                    {formData.message.length}/2000 תווים
                </div>
            </div>
            
            <button 
                className={formStyles.button} 
                type="submit" 
                disabled={loading}
            >
                {loading ? "שולח..." : "שלח הודעה"}
            </button>
            
            {loading && <div className={formStyles.loading}>שולח את הודעתך...</div>}
            {success && <div className={formStyles.success}>{success}</div>}
            {error && <div className={formStyles.error}>{error}</div>}
        </form>
    );
}

export default ContactForm;