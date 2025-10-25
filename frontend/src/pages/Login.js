import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { t } = useTranslation();
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (isAuthenticated) {
        navigate('/');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            setError(err.message || t('login.error_default'));
        } finally {
            setLoading(false);
        }
    };

    const formStyle = {
        maxWidth: '400px',
        margin: '50px auto',
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        textAlign: 'center'
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box'
    };

    const buttonStyle = {
        width: '100%',
        padding: '10px',
        backgroundColor: '#2E8B57',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: loading ? 'not-allowed' : 'pointer',
        marginTop: '20px',
        fontSize: '16px',
        opacity: loading ? 0.7 : 1
    };

    const errorStyle = {
        color: 'red',
        marginTop: '10px'
    };

    return (
        <div style={formStyle}>
            <h2>{t('login.title')}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="email"
                        placeholder={t('login.email_placeholder')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder={t('login.password_placeholder')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                {error && <p style={errorStyle}>{error}</p>}
                <button type="submit" style={buttonStyle} disabled={loading}>
                    {loading ? t('login.loading') : t('login.button')}
                </button>
            </form>
        </div>
    );
};

export default Login;
