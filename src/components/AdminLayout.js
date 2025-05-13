import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import styles from '../styles/Admin.module.css';
import { ChevronDown, ChevronRight, HomeIcon } from 'lucide-react';
import { FaHome, FaEdit, FaBars } from "react-icons/fa";
import { MdOutlineContactPage, MdOutlineInsertPageBreak } from "react-icons/md";
import { RiPagesLine } from "react-icons/ri";
import Footer from '../components/Footer';

const AdminLayout = () => {
    const { pathname } = useLocation();
    const [expandedGroups, setExpandedGroups] = useState({
        Home: true,
        Company: false,
        Others: false,
    });

    const navGroups = [
        {
            title: 'Home',
            links: [
                { to: '/banners', label: 'Manage Banners' },
                { to: '/company-values', label: 'Manage Company Values' },
                { to: '/services', label: 'Manage Services' },
                { to: '/subscriptions', label: 'Manage Subscription' },
            ],
        },
        {
            title: 'Company',
            links: [
                { to: '/eventandnews', label: 'Manage News & Events' },
                { to: '/clientspeak', label: 'Manage Client Speak' },
                { to: '/career', label: 'Manage career' },
                { to: '/followus', label: 'Manage Social Network' },
            ],
        },
        {
            title: 'Portfolio',
            links: [
                { to: '/portfolio', label: 'Projects' },
                { to: '/portfolioCategory', label: 'Project Category' }
            ]
        },
        {
            title: 'Clients & Partners',
            links: [
                { to: '/clients', label: 'Manage Clients' },
                { to: '/partners', label: 'Manage Partners' }
            ]
        },
        {
            title: 'Manage Pages',
            links: [
                { to: '/staticpages', label: 'Create Pages' },
                { to: '/managemenu', label: 'Manage Menu' }
            ]
        },
        {
            title: 'Manage Job-Application',
            links: [
                { to: '/jobapplications', label: 'Manage Application' }
            ]
        }
    ];

    const toggleGroup = (groupName) => {
        if (!collapsed) {
            setExpandedGroups((prevExpandedGroups) => ({
                ...prevExpandedGroups,
                [groupName]: !prevExpandedGroups[groupName],
            }));
        }
    };

    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className={styles.container}>
            <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
                <span className={styles.boldText}>GENERAL</span>
                <button
                    className={styles.toggleButton}
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <FaBars />
                </button>
                {navGroups.map((group) => (
                    <div key={group.title} className={styles.navGroup}>
                        <div
                            className={styles.groupTitle}
                            onClick={() => toggleGroup(group.title)}
                            style={{ cursor: collapsed ? 'default' : 'pointer' }}
                        >
                            <h2 className={styles.sidebarHeading}>
                                <span className={styles.sidebarIcon}>
                                    {group.title === 'Home' && <FaHome size={16} />}
                                    {group.title === 'Company' && <HomeIcon size={16} />}
                                    {group.title === 'Portfolio' && <MdOutlineContactPage size={16} />}
                                    {group.title === 'Clients & Partners' && <FaEdit size={16} />}
                                    {group.title === 'Manage Pages' && <MdOutlineInsertPageBreak size={16} />}
                                    {group.title === 'Manage Job-Application' && <RiPagesLine size={16} />}
                                </span>
                                {!collapsed && <span className={styles.sidebarLabel}>{group.title}</span>}
                            </h2>

                            {!collapsed && (
                                expandedGroups[group.title] ? (
                                    <span className={styles.expandIcon}><ChevronDown size={16} /></span>
                                ) : (
                                    <span className={styles.expandIcon}><ChevronRight size={16} /></span>
                                )
                            )}

                        </div>
                        {!collapsed && expandedGroups[group.title] && (
                            <nav
                                className={
                                    group.title === 'Home' || group.title === 'Company' || group.title === 'Portfolio' || group.title === 'Clients & Partners' || group.title === 'Manage Pages' || group.title === 'Manage Job-Application'
                                        ? `${styles.nav} ${styles.dropdownNav}`
                                        : styles.nav
                                }
                            >
                                {group.links.map(({ to, label }) => (
                                    <Link
                                        key={to}
                                        to={to}
                                        title={label}
                                        className={
                                            pathname.startsWith(to)
                                                ? `${styles.navLink} ${styles.navLinkActive}`
                                                : styles.navLink
                                        }
                                    >
                                        <span>{label}</span>
                                    </Link>

                                ))}
                            </nav>
                        )}
                    </div>
                ))}
                <div className={styles.footerWrapper}>
                    <Footer collapsed={collapsed} />

                </div>
            </aside>
            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
