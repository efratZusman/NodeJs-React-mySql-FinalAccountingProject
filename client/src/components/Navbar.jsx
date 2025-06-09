import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from './UserContext';
import styles from '../styles/Navbar.module.css'; // ייבוא קובץ ה-CSS מודול

function Navbar() {
    const { user, isInitialized, logout } = useUserContext();
    if (!isInitialized) {
        return null;
    }
console.log(`User: ${user ? user.full_name : 'No user logged in'}`);

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
            {user ?
                <button onClick={logout} className={styles.logoutButton}>Log Out</button>
            :
                <button onClick={()=>{console.log("login")}} className={styles.logoutButton}>Log In</button>
            }
        </nav>
    );
}

export default Navbar;