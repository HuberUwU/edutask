import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Link as LinkIcon, Calendar, FileUp, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { rtdb, storageService } from '../firebase';

function SubjectView() {
  const { subjectName } = useParams();
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  
  // Option to upload file OR enter link
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'link'
  const [file, setFile] = useState(null);
  const [linkUrl, setLinkUrl] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [publishedTasks, setPublishedTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchTasks = async () => {
      try {
        const tasks = await rtdb.getAll('tasks');
        if (isMounted) {
          // Filter tasks by current subject
          const subjectTasks = tasks ? tasks.filter(t => t.subject === subjectName).reverse() : [];
          setPublishedTasks(subjectTasks);
          setLoadingTasks(false);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        if (isMounted) setLoadingTasks(false);
      }
    };
    fetchTasks();
    return () => { isMounted = false; };
  }, [subjectName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskName) return;
    if (uploadType === 'file' && !file) return;
    if (uploadType === 'link' && !linkUrl) return;

    setIsUploading(true);
    
    try {
      const taskId = Math.random().toString(36).substring(2, 10);
      let finalUrl = '';
      let fileDesc = 'Enlace Externo';

      if (uploadType === 'file') {
        finalUrl = await storageService.uploadFile(file, `tasks/${encodeURIComponent(subjectName)}`);
        fileDesc = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
      } else {
        finalUrl = linkUrl;
      }
      
      const taskData = {
        id: taskId,
        name: taskName,
        subject: subjectName,
        description,
        type: uploadType,
        fileName: finalUrl,
        originalName: uploadType === 'file' ? file.name : null,
        fileSize: fileDesc,
        date: new Date().toLocaleDateString('es-MX', { 
          year: 'numeric', month: 'long', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        })
      };

      await rtdb.setWithId(`tasks/task_${taskId}`, taskData);
      
      setIsUploading(false);
      navigate(`/success/${taskId}`);
    } catch (error) {
      console.error("Error al procesar la tarea:", error);
      setIsUploading(false);
      alert("Hubo un error de conexión al guardar el trabajo en Firebase.");
    }
  };

  return (
    <div className="upload-section animate-fade-in" style={{ minHeight: 'calc(100vh - 72px)', paddingBottom: '4rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" className="btn btn-outline" style={{ display: 'inline-flex', width: 'auto', background: 'white' }}>
            <ArrowLeft size={18} /> Volver a Materias
          </Link>
          <h2 style={{ color: 'var(--primary)', margin: 0 }}>{subjectName}</h2>
        </div>

        <div className="auth-card" style={{ margin: '0 auto', marginBottom: '4rem' }}>
          <div className="header">
            <h2 style={{ color: 'var(--primary)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Subir Nueva Tarea</h2>
            <p>Sube tu archivo adjunto o enlace para publicarlo en esta materia.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="taskName">Nombre del Trabajo</label>
              <input
                type="text"
                id="taskName"
                className="form-control"
                placeholder="Ej. Resumen del Capítulo 1"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Entrega</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="uploadType" 
                    checked={uploadType === 'file'} 
                    onChange={() => setUploadType('file')} 
                  /> Archivo Adjunto
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="uploadType" 
                    checked={uploadType === 'link'} 
                    onChange={() => setUploadType('link')} 
                  /> Enlace Web
                </label>
              </div>
            </div>

            {uploadType === 'file' ? (
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" htmlFor="fileInput">Seleccionar Archivo</label>
                <input
                  type="file"
                  id="fileInput"
                  className="form-control"
                  style={{ padding: '0.5rem' }}
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
              </div>
            ) : (
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
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="description">Comentarios Opcionales</label>
              <textarea
                id="description"
                className="form-control"
                placeholder="Añade instrucciones, grupo o notas extras..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
              disabled={!taskName || (uploadType === 'file' && !file) || (uploadType === 'link' && !linkUrl) || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="loader" size={20} style={{ display: 'inline-block', marginRight: '8px' }} /> Procesando y subiendo...
                </>
              ) : (
                'Publicar Trabajo'
              )}
            </button>
          </form>
        </div>

        {/* --- RECENT TASKS PARA ESTA MATERIA --- */}
        <div>
          <h2 style={{ color: 'var(--primary)', fontSize: '1.6rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            Trabajos de {subjectName}
          </h2>

          {loadingTasks ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Loader2 className="loader" size={32} style={{ display: 'inline-block', color: 'var(--primary)', margin: '0 auto' }} />
              <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Cargando trabajos...</p>
            </div>
          ) : publishedTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <p style={{ color: 'var(--text-muted)' }}>Aún no hay trabajos publicados en esta materia.</p>
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
                      {task.type === 'file' ? <Download size={16} /> : <LinkIcon size={16} />}
                      {task.type === 'file' ? 'Descargar Archivo' : 'Abrir Enlace'}
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

export default SubjectView;
