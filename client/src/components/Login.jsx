import { useState } from 'react';
import { useUserContext } from './UserContext';
import ApiService from '../ApiService';
import styles from '../styles/Home.module.css';
import Navbar from "./Navbar";
import React from 'react';
import { useNavigate } from "react-router-dom";

function Login({ onSuccess }) {
    // const { fetchUser } = useUserContext();
    const navigate = useNavigate(); // <-- initialize navigate


    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUserData } = useUserContext();
    const apiService = new ApiService();
    const { fetchUser } = useUserContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await apiService.post('/users/login', { email, password });
            if (response.message === 'Login successful') {
                await fetchUser();
                navigate('/home')
    
            }
            else {
                setError('Login failed');
            }
        } catch (error) {
            setError('Invalid email or password');
        }
    };
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setError('');

    //     try {
    //         const response = await apiService.post('/users/login', {
    //             email,
    //             password
    //         });

    //         if (response.message === 'Login successful') {
    //             // const userResponse = await apiService.get('http://localhost:3000/api/users/current');
    //             // setUserData({
    //             //     email: userResponse.email,
    //             //     full_name: userResponse.full_name,
    //             //     role: userResponse.role
    //             // });

    //         }
    //     } catch (error) {
    //         console.error('Login error:', error);
    //         setError('Invalid email or password');
    //     }
    // };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1 className={styles.title}>Login</h1>
                    <p className={styles.description}>Please enter your email and password to login.</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className={styles.authForm}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
                {error && <div className={styles.error}>{error}</div>}
            </form>
        </>
    );
}

export default Login;
