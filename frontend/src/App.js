import React, { useEffect, useState } from 'react';

function App() {
  const [apiStatus, setApiStatus] = useState('Verificando...');
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    // Detectar qual domínio estamos usando
    const currentDomain = window.location.hostname;
    let apiUrl = '';
    
    if (currentDomain === 'api.shapeme.pro') {
      apiUrl = 'http://api.shapeme.pro';
    } else {
      apiUrl = `http://${currentDomain}`;
    }

    // Testar conexão com a API
    fetch(`${apiUrl}/health`)
      .then(response => response.json())
      .then(data => {
        setApiStatus('✅ Conectado');
        setApiData(data);
      })
      .catch(error => {
        setApiStatus('❌ Erro de conexão');
        console.error('Erro:', error);
      });
  }, []);

  const currentDomain = window.location.hostname;

  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#2E8B57', fontSize: '3em', marginBottom: '20px' }}>
        🍃 ShapeMe
      </h1>
      
      <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '30px' }}>
        Receitas saudáveis em breve!
      </p>

      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '10px',
        marginBottom: '30px'
      }}>
        <h3>Status da Aplicação</h3>
        <p><strong>Domínio atual:</strong> {currentDomain}</p>
        <p><strong>API Status:</strong> <span style={{ color: apiStatus.includes('✅') ? 'green' : 'red' }}>{apiStatus}</span></p>
        {apiData && (
          <div style={{ marginTop: '15px', textAlign: 'left' }}>
            <strong>Dados da API:</strong>
            <pre style={{ 
              backgroundColor: '#e9ecef', 
              padding: '10px', 
              borderRadius: '5px',
              fontSize: '12px',
              overflow: 'auto'
            }}>
              {JSON.stringify(apiData, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          backgroundColor: '#e8f5e8', 
          padding: '20px', 
          borderRadius: '10px',
          border: '2px solid #2E8B57'
        }}>
          <h4>🌐 App Principal</h4>
          <p><a href="http://shapeme.pro"  rel="noopener noreferrer">shapeme.pro</a></p>
          <p><a href="http://app.shapeme.pro"  rel="noopener noreferrer">app.shapeme.pro</a></p>
        </div>

        <div style={{ 
          backgroundColor: '#e8f4f8', 
          padding: '20px', 
          borderRadius: '10px',
          border: '2px solid #007bff'
        }}>
          <h4>🔧 API</h4>
          <p><a href="http://api.shapeme.pro"  rel="noopener noreferrer">api.shapeme.pro</a></p>
          <p><a href="http://api.shapeme.pro/docs"  rel="noopener noreferrer">Documentação</a></p>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#fff3cd', 
        padding: '20px', 
        borderRadius: '10px',
        border: '1px solid #ffeaa7'
      }}>
        <h4>📚 Links Úteis</h4>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <a href="/docs"  style={{ color: '#007bff', textDecoration: 'none' }}>📖 Swagger UI</a>
          <a href="/redoc"  style={{ color: '#007bff', textDecoration: 'none' }}>📋 ReDoc</a>
          <a href="/health"  style={{ color: '#007bff', textDecoration: 'none' }}>💚 Health Check</a>
          <a href="/api/test"  style={{ color: '#007bff', textDecoration: 'none' }}>🧪 API Test</a>
        </div>
      </div>

      <footer style={{ marginTop: '40px', color: '#666', fontSize: '0.9em' }}>
        <p>ShapeMe v1.0.0 - Receitas Saudáveis</p>
        <p>Desenvolvido com ❤️ usando React + FastAPI + Docker</p>
      </footer>
    </div>
  );
}

export default App;