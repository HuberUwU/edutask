import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import SubjectView from './pages/SubjectView';
import TaskSuccess from './pages/TaskSuccess';
import TaskView from './pages/TaskView';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { LogOut, Shield } from 'lucide-react';
import './index.css';

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem('isAdminAuth') === 'true';
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuth) {
      navigate('/login');
    }
  }, [isAuth, navigate]);

  return isAuth ? children : null;
};

// Componente Navbar extraído para manejar estado de auth
const AppNavbar = () => {
  const navigate = useNavigate();
  const isAuth = localStorage.getItem('isAdminAuth') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuth');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <img
            src="https://www.cobamich.edu.mx/pagina/assets/cobaem2022.png"
            alt="Logo COBAEM"
            style={{ height: '40px', objectFit: 'contain' }}
            title="Logo COBAEM"
          />
          <span style={{ marginLeft: '10px' }}>EduTasks COBAEM</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {/* Enlaces principales */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }} className="desktop-links">
            <Link to="/" className="nav-link">Inicio</Link>
            <a href="https://hubercbt.blogspot.com/" target="_blank" rel="noopener noreferrer" className="nav-link" style={{ color: 'var(--primary)', fontWeight: '500' }}>Blog</a>
            <a href="https://cobamich.edu.mx/pagina/home" target="_blank" rel="noopener noreferrer" className="nav-link" style={{ color: 'var(--primary)', fontWeight: '500' }}>Acerca de COBAEM</a>
          </div>

          {isAuth ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link to="/admin" style={{ color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                <Shield size={18} /> Panel
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-outline"
                style={{
                  color: 'var(--primary)',
                  borderColor: 'var(--primary)',
                  padding: '0.5rem 1rem',
                  fontSize: '0.9rem'
                }}
              >
                <LogOut size={16} /> Salir
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
              Acceso Administrativo
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="app">
        <AppNavbar />
        <main className="container-fluid" style={{ padding: 0 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/materia/:subjectName" element={<SubjectView />} />
            <Route path="/success/:taskId" element={<TaskSuccess />} />
            <Route path="/task/:taskId" element={<TaskView />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
