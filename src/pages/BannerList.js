import { useState, useEffect, useContext } from 'react';
import styles from '../styles/BannerList.module.css';
import { fetchBanners, deleteBanner, fetchBannerById } from '../api/bannerApi';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function BannerList() {
    const { token } = useContext(AuthContext);
    const [banners, setBanners] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [menuOpen, setMenuOpen] = useState(null);
    const perPage = 5;

    useEffect(() => {
        (async () => {
            const res = await fetchBanners(token);
            setBanners(res.data.data);
        })();
    }, [token]);

    // filter & paginate
    const filtered = banners.filter(b => b.bannerTitle.toLowerCase().includes(search.toLowerCase()));
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);
    const totalPages = Math.ceil(filtered.length / perPage);

    const toggleMenu = (id) => setMenuOpen(menuOpen === id ? null : id);

    return (
        <>
            <div className={styles.header}>
                <h1 className={styles.title}>Home Banners</h1>
                <input
                    className={styles.searchInput}
                    placeholder="Search banners..."
                    value={search}
                    onChange={e => { setPage(1); setSearch(e.target.value); }}
                />
                <Link to="/banners/new">
                    <button className={styles.newButton}>New Banner</button>
                </Link>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Order</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {paginated.map(b => (
                        <tr key={b._id}>
                            <td>{b.displayOrder}</td>
                            <td>{b.bannerTitle}</td>
                            <td>{b.status}</td>
                            <td>
                                <div className={styles.dropdown}>
                                    <button className={styles.actionBtn} onClick={() => toggleMenu(b._id)}>
                                        ⋮
                                    </button>
                                    {menuOpen === b._id && (
                                        <div className={styles.menu}>
                                            <div
                                                className={styles.menuItem}
                                                onClick={async () => {
                                                    const res = await fetchBannerById(b._id, token);
                                                    alert(JSON.stringify(res.data.data, null, 2));
                                                    setMenuOpen(null);
                                                }}
                                            >
                                                View Details
                                            </div>
                                            <Link to={`/banners/${b._id}`} className={styles.menuItem}>Edit</Link>
                                            <div
                                                className={styles.menuItem}
                                                onClick={async () => {
                                                    await deleteBanner(b._id, token);
                                                    setBanners(bs => bs.filter(x => x._id !== b._id));
                                                }}
                                            >
                                                Delete
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ul className={styles.pagination}>
                <li className={styles.pageItem}>
                    <button
                        className={styles.pageLink}
                        onClick={() => setPage(1)}
                        disabled={page === 1}
                    >
                        «
                    </button>
                </li>
                <li className={styles.pageItem}>
                    <button
                        className={styles.pageLink}
                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                        disabled={page === 1}
                    >
                        ‹
                    </button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                    <li key={i + 1} className={styles.pageItem}>
                        <button
                            className={page === i + 1 ? styles.pageLinkActive : styles.pageLink}
                            onClick={() => setPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    </li>
                ))}
                <li className={styles.pageItem}>
                    <button
                        className={styles.pageLink}
                        onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                    >
                        ›
                    </button>
                </li>
                <li className={styles.pageItem}>
                    <button
                        className={styles.pageLink}
                        onClick={() => setPage(totalPages)}
                        disabled={page === totalPages}
                    >
                        »
                    </button>
                </li>
            </ul>
        </>
    );
}
