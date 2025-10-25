import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n';
import App from './App';

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



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);