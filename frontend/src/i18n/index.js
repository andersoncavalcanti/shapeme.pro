import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './i18n';
import App from './App';

// Components
import Layout from './components/common/Layout';

// Pages
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import Categories from './pages/Categories';
import Admin from './pages/Admin';
import Login from './pages/Login';

// Auth
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// CSS Global
const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f8f9fa;
    line-height: 1.6;
  }
  
  a {
    color: inherit;
    text-decoration: none;
  }
  
  button {
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
  }

  /* Scrollbar personalizada */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #2E8B57;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #236B47;
  }

  /* Responsividade */
  @media (max-width: 768px) {
    .nav-menu {
      flex-direction: column;
      gap: 1rem;
    }
  }
`;

// Adicionar estilos globais
const styleSheet = document.createElement("style");
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

function AppWrapper() {
  return (
    <App />
  );
}
            <div style={{
              textAlign: 'center', 
              padding: '4rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤔</div>
              <h2 style={{ color: '#2E8B57', marginBottom: '1rem' }}>
                Página não encontrada
              </h2>
              <p style={{ color: '#666', marginBottom: '2rem' }}>
                A página que você está procurando não existe.
              </p>
              <a 
                href="/" 
                style={{
                  backgroundColor: '#2E8B57',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'background-color 0.3s'
                }}
              >
                🏠 Voltar ao Início
              </a>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);