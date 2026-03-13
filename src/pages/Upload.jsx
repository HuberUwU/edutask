import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Link as LinkIcon, Calendar } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { rtdb } from '../firebase';

function Upload() {
  const [linkUrl, setLinkUrl] = useState('');
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [publishedTasks, setPublishedTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchTasks = async () => {
      try {
        const localTasks = JSON.parse(localStorage.getItem('cobaem_published_tasks') || '[]');
        if (isMounted) {
          setPublishedTasks(localTasks);
          setLoadingTasks(localTasks.length === 0);
        }

        // Try getting from firebase without blocking the UI if it hangs
        rtdb.getAll('tasks').then(fbTasks => {
          if (!isMounted) return;
          const allTasks = [...fbTasks, ...localTasks];
          const uniqueTasks = Array.from(new Map(allTasks.map(item => [item.id, item])).values());
          setPublishedTasks(uniqueTasks);
          setLoadingTasks(false);
        }).catch(err => {
          console.warn('Firebase read error/timeout:', err);
          if (isMounted) setLoadingTasks(false);
        });
      } catch (error) {
        console.error("Error fetching tasks:", error);
        if (isMounted) setLoadingTasks(false);
      }
    };
    fetchTasks();
    return () => { isMounted = false; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskName || !linkUrl) return;

    setIsUploading(true);
    
    try {
      const taskId = Math.random().toString(36).substring(2, 10);
      
      const taskData = {
        id: taskId,
        name: taskName,
        description,
        type: 'link',
        fileName: linkUrl,
        fileSize: 'Enlace',
        date: new Date().toLocaleDateString('es-MX', { 
          year: 'numeric', month: 'long', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        })
      };

      // Guardamos en local para asegurar respuesta rápida sin bloqueos
      const existingTasks = JSON.parse(localStorage.getItem('cobaem_published_tasks') || '[]');
      localStorage.setItem('cobaem_published_tasks', JSON.stringify([taskData, ...existingTasks]));

      // Guardamos en Firebase pero NO lo esperamos (evita colgarlo si Firebase falla)
      rtdb.setWithId(`tasks/task_${taskId}`, taskData).catch(err => console.warn('Firebase write warning:', err));
      
      setIsUploading(false);
      navigate(`/success/${taskId}`);
    } catch (error) {
      console.error("Error al procesar la tarea:", error);
      setIsUploading(false);
      alert("Hubo un error local al preparar el trabajo.");
    }
  };

  return (
    <div className="upload-section animate-fade-in" style={{ minHeight: 'calc(100vh - 72px)', paddingBottom: '4rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/" className="btn btn-outline" style={{ display: 'inline-flex', width: 'auto', background: 'white' }}>
            <ArrowLeft size={18} /> Volver
          </Link>
        </div>

        <div className="auth-card" style={{ margin: '0 auto', marginBottom: '4rem' }}>
          <div className="header">
            <h2 style={{ color: 'var(--primary)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Subir Nueva Tarea</h2>
            <p>Sube tu trabajo o enlace y genera tu código QR.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="taskName">Nombre de la Tarea / Tema</label>
              <input
                type="text"
                id="taskName"
                className="form-control"
                placeholder="Ej. Línea del Tiempo Independencia"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Descripción (Opcional)</label>
              <textarea
                id="description"
                className="form-control"
                placeholder="Añade instrucciones, grupo, grado o notas extras..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" htmlFor="linkUrl">Enlace Externo de la Tarea</label>
              <input
                type="url"
                id="linkUrl"
                className="form-control"
                placeholder="Ej. https://docs.google.com/..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
              disabled={!taskName || !linkUrl || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="loader" size={20} style={{ display: 'inline-block', marginRight: '8px' }} /> Procesando enlace...
                </>
              ) : (
                'Publicar Trabajo'
              )}
            </button>
          </form>
        </div>

        {/* --- RECENT TASKS / QRs --- */}
        <div>
          <h2 style={{ color: 'var(--primary)', fontSize: '1.6rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            Trabajos Publicados
          </h2>

          {loadingTasks ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Loader2 className="loader" size={32} style={{ display: 'inline-block', color: 'var(--primary)', margin: '0 auto' }} />
              <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Cargando trabajos...</p>
            </div>
          ) : publishedTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <p style={{ color: 'var(--text-muted)' }}>Aún no hay trabajos publicados.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {publishedTasks.map(task => (
                <div key={task.id} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.5rem', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={task.name}>
                    {task.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    <Calendar size={14} /> {task.date.split(',')[0]}
                  </div>

                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                    <QRCodeSVG
                      value={task.fileName}
                      size={140}
                      fgColor="#0f1c3f"
                      bgColor="#ffffff"
                      level="M"
                      includeMargin={false}
                    />
                  </div>

                  <div style={{ width: '100%', marginTop: 'auto', display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                    <a href={task.fileName} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', fontSize: '0.9rem' }}>
                      <LinkIcon size={16} /> Abrir Enlace
                    </a>
                    <Link to={`/task/${task.id}`} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', fontSize: '0.9rem' }}>
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`
        .form-control:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(92, 27, 51, 0.2); }
      `}</style>
    </div>
  );
}

export default Upload;
