import styles from '../styles/PageNotFound.module.css';
import NotFoundImage from '../img/404.png'
import Navbar from './Navbar';
function PageNotFound() {
    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <img src={NotFoundImage} alt="Page Not Found" className={styles.image} />
                <strong className={styles.text}>Page Not Found</strong>
            </div>
        </>
    );
}

export default PageNotFound;
