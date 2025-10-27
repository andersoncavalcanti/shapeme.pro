import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import 'react-quill/dist/quill.snow.css';

// 🔹 CSS gerado pelo Tailwind CLI (prebuild/prestart)
import './netflix-theme.css';

// 🔹 Inicializa i18n do projeto (garante LanguageSwitcher)
import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
