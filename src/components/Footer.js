import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/Footer.module.css';
import profileImg from '../assets/anime3.jpg';
import { FaSignOutAlt } from 'react-icons/fa';

const Footer = ({ collapsed }) => {
    const { logout } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={styles.footer} ref={dropdownRef}>
            <div
                className={styles.profileContainer}
                onClick={toggleMenu}
            >
                <img src={profileImg} alt="Profile" className={styles.profileImage} />
                <span className={`${styles.profileText} ${collapsed ? styles.hideText : ''}`}>Admin</span>
            </div>
            {menuOpen && (
                <div className={`${styles.dropdown} ${collapsed ? styles.collapsedDropdown : ''}`}>
                    <button onClick={logout} className={styles.newButton}>
                        Logout
                        <FaSignOutAlt className={styles.logoutIcon} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Footer;
