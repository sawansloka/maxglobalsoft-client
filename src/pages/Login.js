import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Admin.module.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading } = useContext(AuthContext);
    const [error, setError] = useState();
    const nav = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setError(undefined);
        try {
            await login(username, password);
            nav('/banners');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <h2 className={styles.loginTitle}>Admin Login</h2>
            {error && <div className={styles.errorBox}>{error}</div>}
            <form onSubmit={submit}>
                <div className={styles.formGroup}>
                    <label>Username</label>
                    <input
                        className={styles.formControl}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Password</label>
                    <input
                        type="password"
                        className={styles.formControl}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading} className={styles.btnLogin}>
                    {loading ? 'Logging in…' : 'Login'}
                </button>
            </form>
        </div>
    );
}