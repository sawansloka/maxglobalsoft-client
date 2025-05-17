import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/Footer.module.css';
import profileImg from '../assets/anime3.jpg';
import { FaSignOutAlt } from 'react-icons/fa';

const truncateDescription = (description, maxLength) => {
    if (!description) return '';
    if (description.length > maxLength) {
        return description.substring(0, maxLength) + '...';
    }
    return description;
};

export default truncateDescription;