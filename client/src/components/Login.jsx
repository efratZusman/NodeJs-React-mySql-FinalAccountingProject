import { useState } from 'react';
import { useUserContext } from './UserContext';
import ApiService from '../ApiService';
import formStyles from '../styles/Form.module.css';
import styles from '../styles/Login.module.css';
import Navbar from "./Navbar";
import { useNavigate, Link } from "react-router-dom";
import logo from '../assets/images/logo.png';
import { validateEmail, VALIDATION_MESSAGES } from '../utils/validation';

function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const { fetchUser } = useUserContext();
    const apiService = new ApiService();

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
        
        if (!validateEmail(formData.email)) {
            newErrors.email = VALIDATION_MESSAGES.EMAIL;
        }
        
        if (!formData.password) {
            newErrors.password = VALIDATION_MESSAGES.REQUIRED;
        } else if (formData.password.length < 6) {
            newErrors.password = 'הסיסמה חייבת להכיל לפחות 6 תווים';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!validateForm()) {
            return;
        }

        try {
            const response = await apiService.post('/users/login', { 
                email: formData.email.trim(), 
                password: formData.password 
            });
            
            if (response.message === 'Login successful') {
                await fetchUser();
                navigate('/home');
            } else {
                setError('ההתחברות נכשלה. יש לבדוק את האימייל והסיסמה.');
            }
        } catch (error) {
            setError('אימייל או סיסמה לא נכונים. נסה שוב.');
        }
    };

    return (
        <>
            <Navbar />
            <div className={formStyles.formContainer}>
                <img src={logo} alt="Logo" className={styles.logo} />
                <div className={formStyles.formTitle}>התחברות</div>
                <div className={formStyles.formDescription}>הזן את פרטי ההתחברות שלך</div>
                
                {error && <div className={formStyles.error}>{error}</div>}
                
                <form onSubmit={handleSubmit} className={formStyles.form}>
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
                            className={`${formStyles.input} ${errors.password ? formStyles.inputError : ''}`}
                            type="password"
                            name="password"
                            placeholder="סיסמה"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <span className={formStyles.errorText}>{errors.password}</span>}
                    </div>
                    
                    <button className={formStyles.button} type="submit">התחבר</button>
                </form>

                <div className={formStyles.switchAuth}>
                    אין לך חשבון?{' '}
                    <Link to="/register" className={formStyles.link}>הרשמה</Link>
                </div>
            </div>
        </>
    );
}

export default Login;
