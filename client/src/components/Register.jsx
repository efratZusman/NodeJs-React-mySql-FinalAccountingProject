import { useState } from 'react';
import { useUserContext } from './UserContext';
import ApiService from '../ApiService';
import styles from '../styles/Home.module.css';
import Navbar from "./Navbar";

function Register({ onSuccess }) {
    const { fetchUser } = useUserContext();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        wants_updates: false // <-- added
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

        // Client-side validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        console.log('Form data before sending:', formData);

        try {
            const response = await apiService.post('/users/register', {
                full_name: formData.full_name,
                email: formData.email,
                password: formData.password,
                wants_updates: formData.wants_updates // <-- send to server
            });

            if (response.message === 'Register successful') {
                await fetchUser();

                if (onSuccess) onSuccess();
            } else {
                setError('Registration failed');
            }
        } catch (error) {
            console.log('Registration error:', error);
            setError(error.response?.data?.error || 'Registration failed. Please try again.');
        }
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1 className={styles.title}>Register</h1>
                    <p className={styles.description}>Create your account below.</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className={styles.authForm}>
                <input
                    type="text"
                    name="full_name"
                    placeholder="Full Name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password (min 6 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    minLength="6"
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                <label style={{ display: "flex", alignItems: "center", margin: "8px 0" }}>
                    <input
                        type="checkbox"
                        name="wants_updates"
                        checked={formData.wants_updates}
                        onChange={handleChange}
                        style={{ marginRight: "3px" }}
                    />
                    I want to receive updates (optional)
                </label>
                <button type="submit">Create Account</button>
                {error && <div className={styles.error}>{error}</div>}
            </form>
        </>
    );
}

export default Register;
