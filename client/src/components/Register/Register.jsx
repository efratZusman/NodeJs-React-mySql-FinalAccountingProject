import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserContext } from '../UserContext';
import styles from './Register.module.css';
import ApiService from '../ApiSevice';

function Register() {
    const [error, setError] = useState('');
    const [passwordVerify, setPasswordVerify] = useState('');
    const [step, setStep] = useState(1);
    const [website, setWebsite] = useState('');
    const { userData, setUserData } = useUserContext();
    const [additionalInfo, setAdditionalInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const { username } = userData;
    const navigate = useNavigate();
    const apiService = new ApiService();


    const checkIfUserExists = async (username) => {
        try {
            const data = await apiService.fetch(`http://localhost:3000/users/${username}`);
            return data.length > 0;
        }
        catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (website !== passwordVerify) {
            setError('Passwords do not match');
            return;
        }
        const userExists = await checkIfUserExists(username);
        if (userExists) {
            setError('Username already exists');
            return;
        }
        else handleCommit(e)
        setStep(2);
    };

    const handleCommit = async (e) => {
        e.preventDefault();
        const newUser = {
            username,
            website,
            ...additionalInfo,
        };
        try {
            const user = await apiService.post(`http://localhost:3000/users`, newUser);
            setUserData({ username: user.username, id: user.id });
            localStorage.setItem('currentUser', JSON.stringify({ username: user.username, id: user.id }));
            navigate(`/user/${user.id}/home`);
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    return (
        <div className={styles.container}>
            
                <div className={styles.stepContainer}>
                    <h2>Sign Up</h2>
                    <form onSubmit={handleRegister}>
                        <input
                            type="text"
                            placeholder="Enter Your Username"
                            value={username}
                            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Enter Your Password"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            required
                        />
                        
                        <input
                            type="password"
                            placeholder="Verify Your Password"
                            value={passwordVerify}
                            onChange={(e) => setPasswordVerify(e.target.value)}
                            required
                        />
                         <input
                            type="email"
                            placeholder="Enter Your Email"
                            value={additionalInfo.email}
                            onChange={(e) => setAdditionalInfo({ ...additionalInfo, email: e.target.value })}
                            required
                            pattern=".+@.+\..+"
                            title="Please enter a valid email address"
                        />
                        <button type="submit">Sign Up</button>
                    </form>
                    {error && <div className={styles.error}>{error}</div>}
                    <Link to="/login">Go to Login</Link>
                </div>
          
        </div>
    );
}

export default Register;
