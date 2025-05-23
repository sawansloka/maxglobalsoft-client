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
        Home: true, // Keep Home expanded by default for initial view
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
                { to: '/admin/company/followus', label: 'Manage Social Network' },
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

    /**
     * Toggles the expansion state of a navigation group.
     * If the sidebar is collapsed, it manages the display of a modal with links.
     * @param {string} groupName - The name of the group to toggle.
     * @param {Event} event - The click event object.
     * @param {Array} groupLinks - The array of links associated with the group.
     */
    const toggleGroup = (groupName, event, groupLinks) => {
        if (collapsed) {
            // If sidebar is collapsed, show/hide modal
            if (modalLinks && modalLinks.title === groupName) {
                setModalLinks(null); // Hide modal if clicking the same group again
            } else {
                const rect = event.currentTarget.getBoundingClientRect();
                setModalLinks({ title: groupName, links: groupLinks });
                // Position modal to the right of the clicked group title
                setModalPosition({ top: rect.top, left: rect.right + 10 });
            }
        } else {
            // If sidebar is expanded, toggle the group's expanded state
            setExpandedGroups((prevExpandedGroups) => ({
                ...prevExpandedGroups,
                [groupName]: !prevExpandedGroups[groupName],
            }));
        }
    };

    // Effect to handle loading state based on route changes
    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 400); // Simulate network delay
        return () => clearTimeout(timeout);
    }, [location.pathname]);

    return (
        <div className={styles.container}>
            <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
                {/* Modal for collapsed sidebar navigation */}
                {collapsed && modalLinks && (
                    <div
                        className={styles.modal}
                        style={{ top: modalPosition.top, left: modalPosition.left }}
                        onMouseLeave={() => setModalLinks(null)} // Hide modal when mouse leaves
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
                                    onClick={() => setModalLinks(null)} // Hide modal on link click
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}

                {/* General text for sidebar */}
                <span className={styles.boldText}>GENERAL</span>

                {/* Toggle button for collapsing/expanding sidebar */}
                <button
                    className={styles.toggleButton}
                    onClick={() => {
                        if (!collapsed) {
                            // When collapsing, close all expanded groups and hide modal
                            setExpandedGroups({});
                            setModalLinks(null);
                        } else {
                            // When expanding, re-expand the Home group by default
                            setExpandedGroups({ Home: true });
                        }
                        setCollapsed(prev => !prev); // Toggle collapsed state
                    }}
                >
                    <FaBars />
                </button>

                {/* Scrollable container for navigation groups */}
                <div className={styles.sidebarNavContent}>
                    {navGroups.map((group) => (
                        <div key={group.title} className={styles.navGroup}>
                            <div
                                className={styles.groupTitle}
                                onClick={(e) => toggleGroup(group.title, e, group.links)}
                                // Cursor is default when collapsed because modal handles interaction
                                style={{ cursor: collapsed ? 'default' : 'pointer' }}
                            >
                                <h2 className={styles.sidebarHeading}>
                                    <span className={styles.sidebarIcon}>
                                        {/* Dynamic icons based on group title */}
                                        {group.title === 'Home' && <FaHome className={styles.expandIcon} size={16} />}
                                        {group.title === 'Company' && <HomeIcon className={styles.expandIcon} size={16} />}
                                        {group.title === 'Portfolio' && <MdOutlineContactPage className={styles.expandIcon} size={16} />}
                                        {group.title === 'Clients & Partners' && <FaEdit className={styles.expandIcon} size={16} />}
                                        {group.title === 'Manage Pages' && <MdOutlineInsertPageBreak className={styles.expandIcon} size={16} />}
                                        {group.title === 'Manage Job-Application' && <RiPagesLine className={styles.expandIcon} size={16} />}
                                    </span>
                                    {/* Display label only when sidebar is not collapsed */}
                                    {!collapsed && <span className={styles.sidebarLabel}>{group.title}</span>}
                                </h2>

                                {/* Display expand/collapse arrow only when sidebar is not collapsed */}
                                {!collapsed && (
                                    expandedGroups[group.title] ? (
                                        <span className={styles.expandArrow}><ChevronDown size={16} /></span>
                                    ) : (
                                        <span className={styles.expandArrow}><ChevronRight size={16} /></span>
                                    )
                                )}
                            </div>
                            {/* Render navigation links only if the group is expanded and sidebar is not collapsed */}
                            {expandedGroups[group.title] && !collapsed && (
                                <nav
                                    className={
                                        // Apply dropdownNav style to all navigation groups
                                        `${styles.nav} ${styles.dropdownNav}`
                                    }
                                >
                                    {group.links.map(({ to, label }) => (
                                        <Link
                                            key={to}
                                            to={to}
                                            title={label} // Add title for tooltip on hover
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

                {/* Footer section */}
                <div className={styles.footerWrapper}>
                    <Footer collapsed={collapsed} />
                </div>
            </aside>

            {/* Main content area */}
            <main className={styles.content}>
                {loading && <GlobalLoader />} {/* Show loader when content is loading */}
                <Outlet /> {/* Renders nested routes */}
            </main>
        </div>
    );
};

export default AdminLayout;
