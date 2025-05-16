import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import styles from '../styles/Admin.module.css';
import { ChevronDown, ChevronRight, HomeIcon } from 'lucide-react';
import { FaHome, FaEdit, FaBars } from "react-icons/fa";
import { MdOutlineContactPage, MdOutlineInsertPageBreak } from "react-icons/md";
import { RiPagesLine } from "react-icons/ri";
import Footer from '../components/Footer';
import GlobalLoader from '../components/GlobalLoader';
import { useEffect } from 'react';

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
                { to: '/admin/home/banners', label: 'Manage Banners' },
                { to: '/admin/home/company-values', label: 'Manage Company Values' },
                { to: '/admin/home/services', label: 'Manage Services' },
                { to: '/admin/home/subscriptions', label: 'Manage Subscription' },
            ],
        },
        {
            title: 'Company',
            links: [
                { to: '/admin/company/eventandnews', label: 'Manage News & Events' },
                { to: '/admin/company/clientspeak', label: 'Manage Client Speak' },
                { to: '/admin/company/career', label: 'Manage career' },
                { to: '/admin/company/followus', label: 'Manage Social Network' },
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

    const [modalLinks, setModalLinks] = useState(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

    const [loading, setLoading] = useState(false);
    const location = useLocation();



    const toggleGroup = (groupName, event, groupLinks) => {
        if (collapsed) {
            if (modalLinks && modalLinks.title === groupName) {
                setModalLinks(null);
            } else {
                const rect = event.currentTarget.getBoundingClientRect();
                setModalLinks({ title: groupName, links: groupLinks });
                setModalPosition({ top: rect.top, left: rect.right + 10 });
            }
        } else {
            setExpandedGroups((prevExpandedGroups) => ({
                ...prevExpandedGroups,
                [groupName]: !prevExpandedGroups[groupName],
            }));
        }
    };

    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 400); // simulate delay

        return () => clearTimeout(timeout);
    }, [location.pathname]);


    return (
        <div className={styles.container}>
            <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
                {collapsed && modalLinks && (
                    <div
                        className={styles.modal}
                        style={{ top: modalPosition.top, left: modalPosition.left }}
                        onMouseLeave={() => setModalLinks(null)}
                    >

                        <h4 className={`${styles.modalTitle}`} style={{ marginBottom: '10px' }}>
                            {modalLinks.title}
                        </h4>
                        <nav className={`${styles.nav} ${styles.dropdownNav}`}>
                            {modalLinks.links.map(({ to, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className={styles.navLink}
                                    onClick={() => setModalLinks(null)}
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}

                <span className={styles.boldText}>GENERAL</span>
                <button
                    className={styles.toggleButton}
                    onClick={() => {
                        if (!collapsed) {
                            setExpandedGroups({});
                            setModalLinks(null);
                        } else {
                            setExpandedGroups({ Home: true });
                        }
                        setCollapsed(prev => !prev);
                    }}

                >
                    <FaBars />
                </button>
                {navGroups.map((group) => (
                    <div key={group.title} className={styles.navGroup}>
                        <div
                            className={styles.groupTitle}
                            onClick={(e) => toggleGroup(group.title, e, group.links)}
                            style={{ cursor: collapsed ? 'default' : 'pointer' }}
                        >
                            <h2 className={styles.sidebarHeading}>
                                <span className={styles.sidebarIcon}>
                                    {group.title === 'Home' && <FaHome className={styles.expandIcon} size={16} />}
                                    {group.title === 'Company' && <HomeIcon className={styles.expandIcon} size={16} />}
                                    {group.title === 'Portfolio' && <MdOutlineContactPage className={styles.expandIcon} size={16} />}
                                    {group.title === 'Clients & Partners' && <FaEdit className={styles.expandIcon} size={16} />}
                                    {group.title === 'Manage Pages' && <MdOutlineInsertPageBreak className={styles.expandIcon} size={16} />}
                                    {group.title === 'Manage Job-Application' && <RiPagesLine className={styles.expandIcon} size={16} />}
                                </span>
                                {!collapsed && <span className={styles.sidebarLabel}>{group.title}</span>}
                            </h2>

                            {!collapsed && (
                                expandedGroups[group.title] ? (
                                    <span className={styles.expandArrow}><ChevronDown size={16} /></span>
                                ) : (
                                    <span className={styles.expandArrow}><ChevronRight size={16} /></span>
                                )
                            )}

                        </div>
                        {expandedGroups[group.title] && (
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
                {loading && <GlobalLoader />}
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
