import { Link, Outlet, useLocation } from 'react-router-dom';
import styles from '../styles/Home.module.css';

export default function AdminLayout() {
    const { pathname } = useLocation();
    const links = [
        { to: '/banners', label: 'Manage Banners' },
        { to: '/company-values', label: 'Manage Company Values' },
        { to: '/services', label: 'Manage Services' },
        { to: '/subscriptions', label: 'Manage Subscription' },
    ];

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <h2>GENERAL</h2>
                {links.map(({ to, label }) => (
                    <Link
                        key={to}
                        to={to}
                        className={
                            pathname.startsWith(to)
                                ? styles.navLinkActive
                                : styles.navLink
                        }
                    >
                        {label}
                    </Link>
                ))}
            </aside>
            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    );
}
