import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const nav = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(username, password);
            nav('/banners');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    return (
        <div className={styles.loginWrapper}>
            <form onSubmit={submit} className={styles.loginBox}>
                <h2 className={styles.loginTitle}>Admin Login</h2>
                {error && <div className={styles.errorBox}>{error}</div>}
                <div className={styles.inputGroup}>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className={styles.input}
                        placeholder="Enter your username"
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                        placeholder="Enter your password"
                    />
                </div>
                <button type="submit" disabled={loading} className={styles.loginButton}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}
