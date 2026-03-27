import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, ShieldCheck, ChevronRight, QrCode, Link as LinkIcon, Layers, Play } from 'lucide-react';
import heroBg from '../assets/hero.png';
import heroBg2 from '../assets/hero2.png';
import mathImg from '../assets/math_cover.png';
import digitalImg from '../assets/digital_cover.png';
import languageImg from '../assets/language_cover.png';
import historyImg from '../assets/history_cover.png';
import labImg from '../assets/lab_cover.png';
import humanitiesImg from '../assets/humanities_cover.png';
import filesImg from '../assets/files_cover.png';
import gearsGif from '../assets/gears.gif';
import communitiesImg from '../assets/communities_cover.png';
import tutorialVideo from '../assets/usopagina.mp4';

const MATERIAS = [
  { name: 'Pensamiento Matemático', color: '#3b82f6', img: mathImg },
  { name: 'Laboratorio de Cultura Digital', color: '#8b5cf6', img: digitalImg },
  { name: 'Lengua y Comunicación', color: '#f59e0b', img: languageImg },
  { name: 'Conciencia Histórica', color: '#ef4444', img: historyImg },
  { name: 'Laboratorio de Investigación', color: '#10b981', img: labImg },
  { name: 'Humanidades', color: '#ec4899', img: humanitiesImg },
  { name: 'Gestión de Archivos de Texto', color: '#6366f1', img: filesImg },
  { name: 'Comunidades Virtuales', color: '#14b8a6', img: communitiesImg }
];

function Home() {
  const navigate = useNavigate();
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const heroImages = [heroBg, heroBg2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section" style={{ backgroundImage: `url(${heroImages[currentHeroIndex]})`, transition: 'background-image 1s ease-in-out', position: 'relative' }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 style={{ fontSize: '4.5rem', marginBottom: '1rem', textShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
            EDUTASK
          </h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            Somos una plataforma para compartir trabajos mediante códigos QR para facilitar compartir la información.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => {
                const element = document.getElementById('materias');
                if (element) {
                  window.scrollTo({
                    top: element.offsetTop - 70,
                    behavior: 'smooth'
                  });
                }
              }}
              className="btn btn-primary btn-lg"
              style={{ backgroundColor: '#ffffff', color: 'var(--primary)', border: '2px solid transparent', minWidth: '200px', fontSize: '1.1rem', padding: '0.8rem 2rem' }}
            >
              Explorar Materias
            </button>
          </div>
        </div>

        {/* Indicadores del Hero */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.75rem', zIndex: 10 }}>
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroIndex(index)}
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: currentHeroIndex === index ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                boxShadow: currentHeroIndex === index ? '0 0 12px 3px rgba(255, 255, 255, 0.9)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0
              }}
              aria-label={`Cambiar a imagen ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Video Tutorial Section */}
      <section style={{ padding: '4rem 0', background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <Play size={36} className="anim-play" />
              ¿CÓMO USAR LA PÁGINA?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              Mira este breve video tutorial para aprender a subir tus tareas y generar tu código QR en segundos.
            </p>
          </div>
          <div style={{ maxWidth: '800px', margin: '0 auto', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', border: '1px solid var(--border-color)' }}>
            <video
              controls
              style={{ width: '100%', display: 'block' }}
              poster=""
            >
              <source src={tutorialVideo} type="video/mp4" />
              Tu navegador no soporta la reproducción de video.
            </video>
          </div>
        </div>
      </section>

      {/* Materias Section */}
      <section id="materias" className="subjects-section" style={{ padding: '4rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Rotating_earth_%28large%29.gif" alt="Earth GIF" style={{ width: '45px', borderRadius: '50%' }} />
              UNIDADES DE APRENDIZAJE CURRICULAR
            </h2>
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
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ height: '240px', width: '100%', overflow: 'hidden' }}>
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

      {/* Características Section */}
      <section className="features-section" style={{ padding: '5rem 0', background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <img src={gearsGif} alt="Gears GIF" style={{ width: '50px' }} />
              ¿POR QUÉ USAR EDUTASK?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
              Nuestra plataforma está fundamentada en hacer que la entrega digital de tareas sea más rápida, ligera y accesible para todos en el COBAEM.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '2.5rem 2rem', background: '#f8fafc', borderRadius: '16px', textAlign: 'center', border: '1px solid #e2e8f0', transition: 'transform 0.3s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '64px', height: '64px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <QrCode size={32} className="anim-qrcode" />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--text-main)', fontWeight: 'bold' }}>CÓDIGOS QR ENTREGABLES</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                Al enviar tu tarea, el sistema genera inmediatamente un código QR interactivo. Simplemente puedes presentarlo a tu profesor para que lo escanee o imprimirlo en tu cubierta física.
              </p>
            </div>

            <div style={{ padding: '2.5rem 2rem', background: '#f8fafc', borderRadius: '16px', textAlign: 'center', border: '1px solid #e2e8f0', transition: 'transform 0.3s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '64px', height: '64px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <LinkIcon size={32} className="anim-link" />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--text-main)', fontWeight: 'bold' }}>ALMACENAMIENTO POR ENLACES</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                Dile adiós a los correos rebotados por espacio. Vincula tus pesados proyectos directamente desde plataformas en la nube como Google Drive, OneDrive, o Canva.
              </p>
            </div>

            <div style={{ padding: '2.5rem 2rem', background: '#f8fafc', borderRadius: '16px', textAlign: 'center', border: '1px solid #e2e8f0', transition: 'transform 0.3s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '64px', height: '64px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Layers size={32} className="anim-layers" />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--text-main)', fontWeight: 'bold' }}>CLASIFICACIÓN INTUITIVA</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                Tus entregas y materiales del ciclo escolar se mantienen perfectamente clasificados por materia. Encuentra cualquier evidencia en cuestión de segundos, sin perder tiempo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer" style={{ background: 'var(--primary)', padding: '2rem 0' }}>
        <div className="container" style={{ textAlign: 'center', color: 'white' }}>
          <p> Huber Alexander Hernandez Guzman</p>
          <p style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.5rem' }}>Grupo: 403.</p>
        </div>
      </footer>
      <style>{`
        .subject-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }

        @keyframes pulse-scale {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }

        @keyframes pendulum {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(15deg); }
        }

        @keyframes bounce-horizontal {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }

        .anim-play { animation: bounce-horizontal 1.5s infinite ease-in-out; }
        .anim-qrcode { animation: pulse-scale 2s infinite ease-in-out; }
        .anim-link { animation: pendulum 2s infinite ease-in-out; transform-origin: center; display: inline-block; }
        .anim-layers { animation: float 3s infinite ease-in-out; }
      `}</style>
    </div>
  );
}

export default Home;
