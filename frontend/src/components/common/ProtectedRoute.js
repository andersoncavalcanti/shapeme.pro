import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const { t } = useTranslation();

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('loading')}...</h2>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('access_denied.title')}</h2>
                <p>{t('access_denied.message')}</p>
                <button 
                    onClick={() => window.history.back()}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#2E8B57',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '20px'
                    }}
                >
                    {t('access_denied.back_button')}
                </button>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
