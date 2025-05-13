// components/Footer.jsx
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/Footer.module.css';
import profileImg from '../assets/anime3.jpg';
import { FaSignOutAlt } from 'react-icons/fa';

const Footer = ({ collapsed }) => {
    const { logout } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(prevState => !prevState);
    };

    return (
        <div className={styles.footer}>
            <div
                className={styles.profileContainer}
                onClick={toggleMenu}
            >
                <img src={profileImg} alt="Profile" className={styles.profileImage} />
                <span className={`${styles.profileText} ${collapsed ? styles.hideText : ''}`}>Admin</span>
            </div>
            {menuOpen && (
                <div className={styles.dropdown}>
                    <button onClick={logout} className={styles.newButton}>Logout<FaSignOutAlt className={styles.logoutIcon} /></button>
                </div>
            )}
        </div>
    );
};

export default Footer;
