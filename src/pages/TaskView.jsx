import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Calendar, HardDrive, Download, AlertCircle, ArrowLeft, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { rtdb } from '../firebase';

function TaskView() {
  const { taskId } = useParams();
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const loadTask = async () => {
      try {
        const tasks = await rtdb.getAll('tasks');
        const task = tasks.find(t => t.id === taskId);
        
        if (isMounted) {
          if (task) {
            setTaskData(task);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching task", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTask();

    return () => { isMounted = false; };
  }, [taskId]);

  if (loading) {
    return (
      <div className="task-detail" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div className="loader" style={{ borderColor: 'var(--primary-light)', borderTopColor: 'var(--primary)', margin: '0 auto 1.5rem', width: '40px', height: '40px' }} />
        <p style={{ color: 'var(--text-muted)' }}>Cargando información del trabajo...</p>
      </div>
    );
  }

  if (!taskData) {
    return (
      <div className="task-detail" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <AlertCircle size={48} color="var(--accent)" style={{ margin: '0 auto 1.5rem' }} />
        <h2 style={{ color: 'var(--accent)' }}>Trabajo no encontrado</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>El enlace podría estar expirado o el folio de la tarea no existe.</p>
        <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', width: 'auto' }}>
          <ArrowLeft size={18} /> Volver al Inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="task-detail animate-fade-in">
      <div className="task-header">
        <h1 style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: '0.5rem' }}>
          {taskData.name}
        </h1>
        <div className="task-meta">
          <span><Calendar size={16} /> Entregado: {taskData.date}</span>
          <span><HardDrive size={16} /> Folio: #{taskData.id.toUpperCase()}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.2rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Materia</div>
          <div style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '1.1rem' }}>{taskData.subject || 'No especificada'}</div>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Comentarios de la Entrega:</h3>
        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
          {taskData.description ? taskData.description : <em>Sin notas adicionales proporcionadas por el alumno.</em>}
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          {taskData.type === 'file' ? 'Archivo Adjunto' : 'Enlace del Trabajo'}
        </h3>
        <div className="file-attachment" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '250px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="file-icon" style={{ background: 'var(--primary)', color: 'white', display: 'flex', padding: '1rem', borderRadius: '8px' }}>
              <LinkIcon size={28} />
            </div>
            <div className="file-info" style={{ flex: 1 }}>
              <div className="file-name" style={{ fontSize: '1.1rem', wordBreak: 'break-all', marginBottom: '0.2rem' }}>
                <a href={taskData.fileName} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                   {taskData.originalName || taskData.fileName}
                </a>
              </div>
              <div className="file-size" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{taskData.fileSize}</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Escanea para acceder directo</div>
            <QRCodeSVG 
              value={taskData.fileName} 
              size={120}
              fgColor="#0f1c3f"
              bgColor="#ffffff"
              level="M"
              includeMargin={true}
            />
          </div>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <a href={taskData.fileName} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '1rem' }}>
            <ExternalLink size={18} /> {taskData.type === 'file' ? 'Descargar Archivo' : 'Acceder al Enlace'}
          </a>
        </div>
      </div>

      <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Documento asegurado vía Sistema EduTasks COBAEM.
        </p>
      </div>
    </div>
  );
}

export default TaskView;
