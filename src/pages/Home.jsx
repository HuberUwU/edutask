import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, ShieldCheck } from 'lucide-react';

function Home() {
  return (
    <div className="home-container animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Colegio de Bachilleres del Estado de Michoacán</h1>
          <p>Portal de Recepción de Tareas y Trabajos Académicos</p>
          <Link to="/upload" className="btn btn-primary btn-lg mt-4" style={{ backgroundColor: '#ffffff', color: 'var(--primary)', border: '2px solid transparent' }}>
            Ir a Subir un Trabajo
          </Link>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <GraduationCap className="feature-icon" size={40} />
              <h3>Para Alumnos</h3>
              <p>Sube tus proyectos y tareas fácilmente recibiendo un comprobante digital al instante.</p>
            </div>
            <div className="feature-card">
              <BookOpen className="feature-icon" size={40} />
              <h3>Para Profesores</h3>
              <p>Escanea el código QR de los trabajos para acceder inmediatamente a los archivos de tus estudiantes.</p>
            </div>
            <div className="feature-card">
              <ShieldCheck className="feature-icon" size={40} />
              <h3>Seguro y Confiable</h3>
              <p>Tu información y documentos se gestionan a través de enlaces únicos para garantizar privacidad.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container" style={{ textAlign: 'center', color: 'white' }}>
          <p> Huber Alexander Hernandez Guzman</p>
          <p style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.5rem' }}>Grupo: 403</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
