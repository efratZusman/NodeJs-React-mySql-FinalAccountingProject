import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../UserContext'; 
import UserInfo from '../UserInfo'; 
import styles from './Home.module.css';
import ApiService from '../ApiSevice';

function Home() {
    const navigate = useNavigate();
    const { userData, setUserData, isInitialized } = useUserContext();
    // const [name, setName] = useState("");
    const [userDetails, setUserDetails] = useState({});
    const [showUserInfo, setShowUserInfo] = useState(false);
    const apiService = new ApiService();

    useEffect(() => {
        if (isInitialized) {
            fetchUserDetails(userData.username);
            navigate(`/user/${userData.id}/home`)
        }
    }, [isInitialized]);

    const fetchUserDetails = async (username) => {
        try {
            const data = await apiService.fetch(`http://localhost:3000/users/${userData.username}`);
            if (data) {
                console.log('User details:', data)
                // setName(data.Username);
                setUserDetails(data);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setUserData({ username: '', id: '' });
        navigate('/login');
    };

    return (
        <div className={styles.container}>
            <button onClick={handleLogout} className={styles.logoutButton}>
                Log Out
            </button>
            <h1 className={styles.mainTitle}>Welcome, {userData.username}!!!</h1>
            <div className={styles.content}>
                <Link to={`/user/${userData.id}/todos`} className={styles.card}>
                    <div className={`${styles.image} ${styles.todosCard}`}></div>
                    <span>Todos</span>
                </Link>
                <Link to={`/user/${userData.id}/posts`} className={styles.card}>
                    <div className={`${styles.image} ${styles.postsCard}`}></div>
                    <span>Posts</span>
                </Link>
                {/* <Link to={`/user/${userData.id}/albums`} className={styles.card}>
                    <div className={`${styles.image} ${styles.albumsCard}`}></div>
                    <span>Albums</span>
                </Link> */}
                <div className={styles.infoSection}>
                    <div onClick={()=>{setShowUserInfo(true);}} className={styles.card}>
                        <div className={`${styles.image} ${styles.infoCard}`}></div>
                        <span>User Info</span>
                    </div>
                    {showUserInfo && (
                        <div className={styles.userInfoPopup}>
                            <UserInfo userDetails={userDetails} onClose={()=>{setShowUserInfo(false)}} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
