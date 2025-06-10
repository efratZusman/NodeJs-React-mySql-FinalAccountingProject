import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from './UserContext';
import styles from '../styles/Navbar.module.css'; // ייבוא קובץ ה-CSS מודול

function Navbar() {
    const { user, isInitialized, logout } = useUserContext();
    const [showLogin, setShowLogin] = useState(true);
    const navigate = useNavigate(); // <-- initialize navigate

    if (!isInitialized) {
        console.log("User data is not initialized yet.");
        
        return null;
    }
    console.log(`User: ${user ? user.full_name : 'No user logged in'}`);
    const handleAuthClick = () => {
        if (showLogin) {
            navigate('/login');
        } else {
            navigate('/register');
        }
    };
    return (
        <nav className={styles.navbar}>
            {user && <div className={styles.userName}>{user.full_name}</div>}
            <div className={styles.links}>
                <Link to={`/home`} className={styles.link}>Home</Link>
                <Link to={`/about`} className={styles.link}>About</Link>
                <Link to={`/clients`} className={styles.link}>Clients</Link>
                <Link to={`/articles`} className={styles.link}>Articles</Link>
                <Link to={`/newsletters`} className={styles.link}>Newsletters</Link>
                <Link to={`/updates`} className={styles.link}>Updates</Link>
                <Link to={`/contact`} className={styles.link}>Contact</Link>
            </div>
            {user ? (
                <button onClick={logout} className={styles.logoutButton}>Log Out</button>
            ) : (
                <>
                    <div className={styles.authToggleGroup}>
                        <button
                            className={`${styles.authToggleBtn} ${showLogin ? styles.active : ''}`}
                            onClick={() => setShowLogin(true)}
                            type="button"
                        >
                            Log In
                        </button>
                        <button
                            className={`${styles.authToggleBtn} ${!showLogin ? styles.active : ''}`}
                            onClick={() => setShowLogin(false)}
                            type="button"
                        >
                            Register
                        </button>
                    </div>
                    <button
                        onClick={handleAuthClick}
                        className={styles.logoutButton}
                        style={{ marginLeft: "10px" }}
                        onMouseDown={e => e.preventDefault()}
                    >
                        {showLogin ? "Log In" : "Register"}
                    </button>
                </>
            )}
        </nav>
    );
}

export default Navbar;