import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, ShieldCheck, ChevronRight } from 'lucide-react';
import heroBg from '../assets/hero.png';

const MATERIAS = [
  { name: 'Pensamiento Matemático I', color: '#3b82f6', img: 'https://placehold.co/600x400/3b82f6/ffffff?text=Matemáticas' },
  { name: 'Cultura Digital I', color: '#8b5cf6', img: 'https://placehold.co/600x400/8b5cf6/ffffff?text=Cultura+Digital' },
  { name: 'Lengua y Comunicación I', color: '#f59e0b', img: 'https://placehold.co/600x400/f59e0b/ffffff?text=Lengua' },
  { name: 'Conciencia Histórica I', color: '#ef4444', img: 'https://placehold.co/600x400/ef4444/ffffff?text=Historia' },
  { name: 'Laboratorio de Investigación', color: '#10b981', img: 'https://placehold.co/600x400/10b981/ffffff?text=Investigación' },
  { name: 'Humanidades I', color: '#ec4899', img: 'https://placehold.co/600x400/ec4899/ffffff?text=Humanidades' },
  { name: 'Gestión de Archivos de Texto', color: '#6366f1', img: 'https://placehold.co/600x400/6366f1/ffffff?text=Archivos' }
];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Edutask COBAEM</h1>
          <p>Portal de Subida de Tareas y Trabajos Académicos</p>
          <a href="#materias" className="btn btn-primary btn-lg mt-4" style={{ backgroundColor: '#ffffff', color: 'var(--primary)', border: '2px solid transparent' }}>
            Explorar Materias
          </a>
        </div>
      </section>

      {/* Materias Section */}
      <section id="materias" className="subjects-section" style={{ padding: '4rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '1rem' }}>Unidades de Aprendizaje Curricular</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              Selecciona tu materia para subir trabajos, consultar lineamientos y acceder a los proyectos compartidos.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {MATERIAS.map((materia, idx) => (
              <div 
                key={idx} 
                className="subject-card" 
                onClick={() => navigate(`/materia/${encodeURIComponent(materia.name)}`)}
                style={{ 
                  background: 'white', 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', 
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ height: '160px', width: '100%', overflow: 'hidden' }}>
                  <img 
                    src={materia.img} 
                    alt={materia.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0 }}>{materia.name}</h3>
                  <ChevronRight color={materia.color} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer" style={{ background: 'var(--primary)', padding: '2rem 0' }}>
        <div className="container" style={{ textAlign: 'center', color: 'white' }}>
          <p> Huber Alexander Hernandez Guzman</p>
          <p style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.5rem' }}>Grupo: 403. © 2026 COBAEM.</p>
        </div>
      </footer>
      <style>{`
        .subject-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}

export default Home;
