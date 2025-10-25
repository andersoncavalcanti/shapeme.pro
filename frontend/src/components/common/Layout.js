import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#f8f9fa'
    }}>
      <Navbar />
      <main style={{ flex: 1, padding: '20px 0' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;