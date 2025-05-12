import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import styles from '../styles/Admin.module.css';
import { ChevronDown, ChevronRight } from 'lucide-react'; // Import icons
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
                { to: '/portfolio', label: 'Manage Portfolio' },
                { to: '/job-applications', label: 'Manage Job-Applications' },
            ],
        },
        {
            title: 'Others',
            links: [
                { to: '/clients-partners', label: 'Clients & Partners' },
                { to: '/pages', label: 'Manage Pages' }
            ]
        }
    ];

    const toggleGroup = (groupName) => {
        setExpandedGroups((prevExpandedGroups) => ({
            ...prevExpandedGroups,
            [groupName]: !prevExpandedGroups[groupName],
        }));
    };

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <span className={styles.boldText}>GENERAL</span>
                {navGroups.map((group) => (
                    <div key={group.title} className={styles.navGroup}>
                        <div
                            className={styles.groupTitle}
                            onClick={() => toggleGroup(group.title)}

                        >
                            <h2 className={styles.sidebarHeading}>{group.title}</h2>
                            {expandedGroups[group.title] ? (
                                <ChevronDown className={styles.expandIcon} size={16} />
                            ) : (
                                <ChevronRight className={styles.expandIcon} size={16} />
                            )}
                        </div>
                        {expandedGroups[group.title] && (
                            <nav className={styles.nav}>
                                {group.links.map(({ to, label }) => (
                                    <Link
                                        key={to}
                                        to={to}
                                        className={
                                            pathname.startsWith(to)
                                                ? `${styles.navLink} ${styles.navLinkActive}`
                                                : styles.navLink
                                        }
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </nav>
                        )}
                    </div>
                ))}
                <div className={styles.footerWrapper}>
                    <Footer />
                </div>
            </aside>
            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
