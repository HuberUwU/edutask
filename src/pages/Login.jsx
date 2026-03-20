import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Loader2, KeyRound } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    // Validamos que los campos no estén vacíos
    if (!email || !password) {
      setError('Por favor, ingresa correo y contraseña.');
      return;
    }

    setIsLoading(true);

    // Simular petición al servidor (Credenciales falsas: admin@cobaem.edu.mx / 123456)
    setTimeout(() => {
      setIsLoading(false);
      
      if (email === 'admin@cobaem.edu.mx' && password === '123456') {
        localStorage.setItem('isAdminAuth', 'true');
        // Redirigir al panel
        window.location.hash = '/admin'; // Usamos hash para HashRouter
        window.location.reload(); // Forzamos carga para que navbar actualice
      } else {
        setError('Credenciales incorrectas. (Pista: admin@cobaem.edu.mx / 123456)');
      }
    }, 1000);
  };

  return (
    <div className="animate-fade-in" style={{ 
      minHeight: 'calc(100vh - 72px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e6f2ef 100%)'
    }}>
      <div className="container" style={{ width: '100%', maxWidth: '500px' }}>
        
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/" className="btn btn-outline" style={{ display: 'inline-flex', width: 'auto', background: 'white' }}>
            <ArrowLeft size={18} /> Volver al Inicio
          </Link>
        </div>

        <div className="auth-card" style={{ margin: '0', width: '100%', maxWidth: 'none', background: 'white' }}>
          <div className="header" style={{ marginBottom: '2.5rem' }}>
            <div style={{ 
              background: 'var(--primary-light)', 
              color: 'var(--primary)', 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <ShieldCheck size={40} />
            </div>
            <h2 style={{ color: 'var(--primary)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Acceso Administrativo</h2>
            <p>Portal exclusivo para docentes de COBAEM</p>
          </div>

          {error && (
            <div style={{ 
              background: '#fee2e2', 
              color: '#b91c1c', 
              padding: '1rem', 
              borderRadius: '8px', 
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              border: '1px solid #fca5a5'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Correo Institucional</label>
              <input 
                type="email" 
                id="email"
                className="form-control" 
                placeholder="ejemplo@cobaem.edu.mx"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Contraseña</label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  id="password"
                  className="form-control" 
                  placeholder="••••••••"
                  style={{ paddingLeft: '2.5rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="loader" size={20} style={{ display: 'inline-block', marginRight: '8px' }} /> Verificando...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
