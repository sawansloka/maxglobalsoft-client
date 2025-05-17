import React from 'react';
import styles from '../styles/GlobalLoader.module.css';

const GlobalLoader = () => {
    return (
        <div className={styles.loaderOverlay}>
            <div className={styles.loader}></div>
        </div>
    );
};

export default GlobalLoader;
