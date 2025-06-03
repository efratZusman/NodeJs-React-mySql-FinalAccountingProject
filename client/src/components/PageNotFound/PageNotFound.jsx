import React from 'react';
import styles from './PageNotFound.module.css';
import NotFoundImage from '../../img/404.gif'
function PageNotFound() {
    return (
        <div className={styles.container}>
            <img src={NotFoundImage} alt="Page Not Found" className={styles.image} />
            <strong className={styles.text}>Page Not Found</strong>
        </div>
    );
}

export default PageNotFound;
