import { useState } from 'react';
import { useUserContext } from './UserContext';
import ApiService from '../ApiService';
import formStyles from '../styles/Form.module.css';
import Navbar from "./Navbar";
import { useNavigate, Link } from "react-router-dom";
import logo from '../assets/images/logo.png';
import { validateEmail, validateNotEmpty } from '../utils/validation';
import Register from './Register'; // ייבוא כפי שביקשת

function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { fetchUser } = useUserContext();
    const apiService = new ApiService();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateEmail(email)) {
            setError('אימייל לא תקין');
            return;
        }
        if (!validateNotEmpty(password)) {
            setError('יש להזין סיסמה');
            return;
        }
        try {
            const response = await apiService.post('/users/login', { email, password });
            if (response.message === 'Login successful') {
                await fetchUser();
                navigate('/home');
            } else {
                setError('Login failed');
            }
        } catch (error) {
            setError('Invalid email or password');
        }
    };

    return (
        <>
            <Navbar />
            <div className={formStyles.formContainer}>
                <img src={logo} alt="Logo" style={{ height: 60, marginBottom: 16 }} />
                <div className={formStyles.formTitle}>Login</div>
                <div className={formStyles.formDescription}>Please enter your email and password to login.</div>
                <form onSubmit={handleSubmit} className={formStyles.form}>
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
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className={formStyles.button} type="submit">Login</button>
                    {error && <div className={formStyles.error}>{error}</div>}
                </form>

                {/* קישור לעמוד הרשמה */}
                <div className={formStyles.switchAuth}>
                    אין לך חשבון?{' '}
                    <Link to="/register" className={formStyles.link}>להרשמה</Link>
                </div>
            </div>
        </>
    );
}

export default Login;
