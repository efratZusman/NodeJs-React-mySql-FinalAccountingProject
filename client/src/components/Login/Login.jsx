import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserContext } from '../UserContext';
import ApiService from '../ApiSevice';
import styles from './Login.module.css';

function Login() {
    const [exist, setExist] = useState(true);
    const [website, setWebsite] = useState('');
    const { userData, setUserData } = useUserContext();
    const { username } = userData;
    const navigate = useNavigate();
    const apiService = new ApiService();

    // const checkIfUserExists = async () => {
    //     try {
    //         const data = await apiService.fetch(`http://localhost:3000/users/${userData.username}`);
    //     //     if (data.length > 0) {
    //     //         const user = data[0];
    //     //         console.log(user);
    //     //         if (user.passwordHash === website) {
    //     //             addUserToLocalStorage(user.id);
    //     //             setUserData({ ...userData, id: user.id });
    //     //             setWebsite('');
    //     //             navigate(`/user/${user.username}/home`);
    //     //             return true;
    //     //         }
    //     //         return false;
    //     //     }
    //     //     return false;
    //     // } catch (error) {
    //     //     console.error('Error checking if user exists:', error);
    //     //     return false;
    //     // }
    // };

    const checkIfUserExists = async () => {
    try {
        const user = await apiService.fetch(`http://localhost:3000/users/${userData.username}`);
        if (user && user.PasswordHash === website) {
            addUserToLocalStorage(user.UserID);
            setUserData({ ...userData, id: user.UserID });
            setWebsite('');
            navigate(`/user/${user.id}/home`);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error checking if user exists:', error);
        return false;
    }
};

    const addUserToLocalStorage = (id) => {
        let currentUser = { username: username, id: id };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    };

    const handleAddUser = async () => {
        let foundUser = await checkIfUserExists();
        if (!foundUser) {
            setExist(false);
            resetForm();
        }
    };

    const resetForm = () => {
        setUserData({ username: '', id: '' });
    };

    return (
        <div className={styles.container}>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Enter Your Username"
                value={username}
                onChange={(e) => { setUserData({ ...userData, username: e.target.value }) }}
            />
            <input
                type="password"
                placeholder="Enter Your Password"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
            />
            <button onClick={() => handleAddUser()}>Submit</button>
            {!exist && <div className={styles.error}>User does not exist</div>}
            <Link to="/register">Go to Sign Up</Link>
        </div>
    );
}

export default Login;
