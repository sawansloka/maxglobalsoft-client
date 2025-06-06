import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import styles from '../styles/Admin.module.css';
import { ChevronDown, ChevronRight, HomeIcon } from 'lucide-react';
import { FaHome, FaEdit, FaBars } from "react-icons/fa";
import { MdOutlineContactPage, MdOutlineInsertPageBreak } from "react-icons/md";
import { RiPagesLine } from "react-icons/ri";
import Footer from '../components/Footer';
import GlobalLoader from '../components/GlobalLoader';

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
                { to: '/admin/company/event-news', label: 'Manage News & Events' },
                { to: '/admin/company/client-speak', label: 'Manage Client Speak' },
                { to: '/admin/company/career', label: 'Manage career' },
                { to: '/admin/company/follow-us', label: 'Manage Social Network' },
            ],
        },
        {
            title: 'Portfolio',
            links: [
                { to: '/admin/portfolio/project', label: 'Projects' },
                { to: '/admin/portfolio/project-category', label: 'Project Category' }
            ]
        },
        {
            title: 'Clients & Partners',
            links: [
                { to: '/admin/partner/client', label: 'Manage Clients' },
                { to: '/admin/partner/partner', label: 'Manage Partners' }
            ]
        },
        {
            title: 'Manage Pages',
            links: [
                { to: '/admin/page/page', label: 'Create Pages' },
                { to: '/admin/page/menu', label: 'Manage Menu' }
            ]
        },
        {
            title: 'Manage Job-Application',
            links: [
                { to: '/admin/application/job-application', label: 'Manage Application' }
            ]
        }
    ];

    const [modalLinks, setModalLinks] = useState(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

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

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 400);
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

                <div className={styles.sidebarNavContent}>
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
                            {expandedGroups[group.title] && !collapsed && (
                                <nav
                                    className={
                                        `${styles.nav} ${styles.dropdownNav}`
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
                </div>

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
