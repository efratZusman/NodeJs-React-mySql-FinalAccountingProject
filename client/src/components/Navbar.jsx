import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from './UserContext';
import styles from '../styles/Navbar.module.css'; // ייבוא קובץ ה-CSS מודול
import logo from '../assets/images/logo.png'; // adjust path as needed

function Navbar() {
    const { user, isInitialized, logout } = useUserContext();
    // const [showLogin, setShowLogin] = useState(true);
    const navigate = useNavigate(); // <-- initialize navigate

    if (!isInitialized) {
        console.log("User data is not initialized yet.");

        return null;
    }
    console.log(`User: ${user ? user.full_name : 'No user logged in'}`);
    console.log(`UserObj: ${user ? user : 'No user logged in'}`);

    const handleAuthClick = () => {
        // if (showLogin) {
            navigate('/login');
        // } else {
        //     navigate('/register');
        // }
    };
    return (
        <nav className={styles.navbar}>
            <Link to="/home">
                <img src={logo} alt="Logo" className={styles.logo} />
            </Link>
            <div className={styles.links}>
                <Link to={`/home`} className={styles.link}>עמוד הבית</Link>
                <Link to={`/about`} className={styles.link}>אודות</Link>
                <Link to={`/clients`} className={styles.link}>לקוחות</Link>
                <Link to={`/articles`} className={styles.link}>מידע מקצועי</Link>
                <Link to={`/newsletters`} className={styles.link}>ניוזלטרים</Link>
                <Link to={`/updates`} className={styles.link}>עדכונים</Link>
                <Link to={`/contact`} className={styles.link}>יצירת קשר</Link>
            </div>
            {user ? (<>
                <div className={styles.userName}>{user.full_name}</div>

                <button onClick={logout} className={styles.logoutButton}>Log Out</button>
            </>
            ) : (
                <>
                    {/* <div className={styles.authToggleGroup}>
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
                    </div> */}
                    <button
                        onClick={handleAuthClick}
                        className={`${styles.logoutButton} ${styles.loginButton}`}
                        onMouseDown={e => e.preventDefault()}
                    >
                        Log In
                    </button>

                </>
            )}
        </nav>
    );
}

export default Navbar;