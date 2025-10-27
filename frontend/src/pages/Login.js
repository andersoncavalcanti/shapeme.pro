import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg(
        (err && (err.message || err.error || err.detail)) || t('login.error_default')
      );
    } finally {
      setLoading(false);
    }
  };

  // estilos simples in-line para manter consistência com o resto do app
  const page = { minHeight: 'calc(100vh - 220px)', display: 'grid', placeItems: 'center', padding: '2rem' };
  const card = { width: '100%', maxWidth: 420, background: '#fff', borderRadius: 12, padding: '2rem', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #e9ecef' };
  const title = { margin: 0, marginBottom: '0.25rem', fontSize: '1.75rem', color: '#2E8B57' };
  const subtitle = { marginTop: 0, marginBottom: '1.5rem', color: '#6c757d', fontSize: '0.95rem' };
  const label = { fontWeight: 600, marginBottom: 6, display: 'block' };
  const inputWrap = { marginBottom: '1rem' };
  const input = { width: '100%', padding: '0.75rem 0.9rem', borderRadius: 8, border: '1px solid #ced4da', outline: 'none' };
  const pwdRow = { display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '0.5rem' };
  const toggle = { border: '1px solid #ced4da', background: '#f8f9fa', borderRadius: 8, padding: '0.6rem 0.8rem', cursor: 'pointer' };
  const btn = { width: '100%', background: '#2E8B57', color: '#fff', border: 'none', padding: '0.85rem 1rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer' };
  const btnDisabled = { ...btn, opacity: 0.7, cursor: 'not-allowed' };
  const err = { background: '#fff5f5', border: '1px solid #f5c2c7', color: '#b02a37', padding: '0.75rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.95rem' };
  const hint = { textAlign: 'center', color: '#6c757d', fontSize: '0.9rem', marginTop: '0.75rem' };

  return (
    <div style={page}>
      <div style={card}>

        <h1 style={title}>{t('login.title')}</h1>
        <p style={subtitle}>🍃 ShapeMe — React + FastAPI</p>

        {errorMsg ? <div role="alert" style={err}>❌ {errorMsg}</div> : null}

        <form onSubmit={handleSubmit} noValidate>
          <div style={inputWrap}>
            <label htmlFor="email" style={label}>E-mail</label>
            <input
              id="email"
              type="email"
              required
              placeholder={t('login.email_placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={input}
              autoComplete="email"
            />
          </div>

          <div style={inputWrap}>
            <label htmlFor="password" style={label}>{t('form.password') || 'Senha'}</label>
            <div style={pwdRow}>
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                required
                placeholder={t('login.password_placeholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={input}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                aria-label="Mostrar/ocultar senha"
                style={toggle}
                title={showPwd ? 'Ocultar' : 'Mostrar'}
              >
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={loading ? btnDisabled : btn}>
            {loading ? t('login.loading') : t('login.button')}
          </button>
        </form>

        <p style={hint}>
          {t('status.api_connected')} · <a href="/docs" style={{ color: '#2E8B57', textDecoration: 'none', fontWeight: 600 }}>Swagger</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

