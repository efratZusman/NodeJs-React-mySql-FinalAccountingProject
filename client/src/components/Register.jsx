import { useState } from 'react';
import { useUserContext } from './UserContext';
import ApiService from '../ApiService';
import formStyles from '../styles/Form.module.css';
import Navbar from "./Navbar";
import { useNavigate, Link } from "react-router-dom";  // הוספתי את Link
import logo from '../assets/images/logo.png';
import {
    validateEmail,
    validatePassword,
    validateNotEmpty
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
    const apiService = new ApiService();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateNotEmpty(formData.full_name)) {
            setError('יש להזין שם מלא');
            return;
        }
        if (!validateEmail(formData.email)) {
            setError('אימייל לא תקין');
            return;
        }
        if (!validatePassword(formData.password)) {
            setError('סיסמה לא תקינה (8-20 תווים, אותיות גדולות/קטנות, מספר, סימן)');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('הסיסמאות לא תואמות');
            return;
        }

        try {
            const response = await apiService.post('/users/register', {
                full_name: formData.full_name,
                email: formData.email,
                password: formData.password,
                wants_updates: formData.wants_updates
            });

            if (response.message === 'Register successful') {
                await fetchUser();
                navigate('/home');
            } else {
                setError('Registration failed');
            }
        } catch (error) {
            setError(error.data?.error || error.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <>
            <Navbar />
            <div className={formStyles.formContainer}>
                <img src={logo} alt="Logo" style={{ height: 60, marginBottom: 16 }} />
                <div className={formStyles.formTitle}>Register</div>
                <div className={formStyles.formDescription}>Create your account below.</div>
                <form onSubmit={handleSubmit} className={formStyles.form}>
                    <input
                        className={formStyles.input}
                        type="text"
                        name="full_name"
                        placeholder="Full Name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className={formStyles.input}
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className={formStyles.input}
                        type="password"
                        name="password"
                        placeholder="Password (8-20 chars, upper/lowercase, number, symbol)"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className={formStyles.input}
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <label className={formStyles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="wants_updates"
                            checked={formData.wants_updates}
                            onChange={handleChange}
                        />
                        I want to receive updates (optional)
                    </label>
                    <button className={formStyles.button} type="submit">Create Account</button>
                    {error && <div className={formStyles.error}>{error}</div>}
                </form>

                {/* קישור חזרה להתחברות */}
                <div className={formStyles.switchAuth} style={{ marginTop: 16, textAlign: 'center' }}>
                    כבר יש לך חשבון?{' '}
                    <Link to="/login" className={formStyles.link}>להתחברות</Link>
                </div>
            </div>
        </>
    );
}

export default Register;
