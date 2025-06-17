import { useState } from 'react';
import { useUserContext } from './UserContext';
import ApiService from "../utils/ApiService";
import formStyles from '../styles/Form.module.css';
import styles from '../styles/Register.module.css';
import Navbar from "./Navbar";
import { useNavigate, Link } from "react-router-dom";
import logo from '../assets/images/logo.png';
import { 
    validateEmail, 
    validatePassword, 
    validateFullName,
    VALIDATION_MESSAGES 
} from '../utils/validation';

function Register() {
    const navigate = useNavigate();
    const { fetchUser } = useUserContext();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        wants_updates: false
    });
    const [errors, setErrors] = useState({});
    const apiService = new ApiService();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!validateFullName(formData.full_name)) {
            newErrors.full_name = VALIDATION_MESSAGES.FULL_NAME;
        }
        
        if (!validateEmail(formData.email)) {
            newErrors.email = VALIDATION_MESSAGES.EMAIL;
        }
        
        if (!validatePassword(formData.password)) {
            newErrors.password = VALIDATION_MESSAGES.PASSWORD;
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'הסיסמאות אינן תואמות';
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
            const response = await apiService.post('/users/register', {
                full_name: formData.full_name.trim(),
                email: formData.email.trim(),
                password: formData.password,
                wants_updates: formData.wants_updates
            });

            if (response.message === 'Register successful') {
                await fetchUser();
                navigate('/home');
            } else {
                setError('ההרשמה נכשלה. אנא נסה שוב.');
            }
        } catch (error) {
            setError(error.data?.error || error.message || 'ההרשמה נכשלה. אנא נסה שוב.');
        }
    };

    return (
        <>
            <Navbar />
            <div className={formStyles.formContainer}>
                <img src={logo} alt="Logo" className={styles.logo} />
                <div className={formStyles.formTitle}>הרשמה</div>
                <div className={formStyles.formDescription}>צור חשבון חדש</div>
                
                {error && <div className={formStyles.error}>{error}</div>}
                
                <form onSubmit={handleSubmit} className={formStyles.form}>
                    <div className={formStyles.formGroup}>
                        <input
                            className={`${formStyles.input} ${errors.full_name ? formStyles.inputError : ''}`}
                            type="text"
                            name="full_name"
                            placeholder="שם מלא"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                        />
                        {errors.full_name && <span className={formStyles.errorText}>{errors.full_name}</span>}
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
                            className={`${formStyles.input} ${errors.password ? formStyles.inputError : ''}`}
                            type="password"
                            name="password"
                            placeholder="סיסמה (8-20 תווים, אותיות גדולות/קטנות, מספר, סימן)"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <span className={formStyles.errorText}>{errors.password}</span>}
                    </div>
                    
                    <div className={formStyles.formGroup}>
                        <input
                            className={`${formStyles.input} ${errors.confirmPassword ? formStyles.inputError : ''}`}
                            type="password"
                            name="confirmPassword"
                            placeholder="אימות סיסמה"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        {errors.confirmPassword && <span className={formStyles.errorText}>{errors.confirmPassword}</span>}
                    </div>
                    
                    <label className={formStyles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="wants_updates"
                            checked={formData.wants_updates}
                            onChange={handleChange}
                        />
                        אני מעוניין לקבל עדכונים במייל 
                    </label>
                    
                    <button className={formStyles.button} type="submit">צור חשבון</button>
                </form>

                <div className={formStyles.switchAuth}>
                    כבר יש לך חשבון?{' '}
                    <Link to="/login" className={formStyles.link}>התחברות</Link>
                </div>
            </div>
        </>
    );
}

export default Register;
