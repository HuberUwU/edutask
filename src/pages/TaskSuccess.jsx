import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, Copy, ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import { rtdb } from '../firebase';

function TaskSuccess() {
  const { taskId } = useParams();
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="auth-card animate-fade-in success-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
        <div className="loader" style={{ borderColor: 'var(--primary-light)', borderTopColor: 'var(--primary)', margin: '0 auto 1.5rem', width: '40px', height: '40px' }} />
        <p style={{ color: 'var(--text-muted)' }}>Generando código QR...</p>
      </div>
    );
  }

  if (!taskData) {
    return (
      <div className="auth-card animate-fade-in success-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
         <h2 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Error</h2>
         <p style={{ color: 'var(--text-muted)' }}>No se encontró la tarea.</p>
         <Link to="/" className="btn btn-primary" style={{ marginTop: '2rem', display: 'inline-flex', width: 'auto' }}>
           <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Volver al Inicio
         </Link>
      </div>
    );
  }

  // El QR ahora manda directo al enlace externo
  const externalLink = taskData.fileName;

  return (
    <div className="auth-card animate-fade-in success-card">
      <CheckCircle2 className="success-icon mx-auto" style={{ display: 'inline-block' }} />
      <div className="header" style={{ marginBottom: '1rem' }}>
        <h1 style={{ color: '#10b981' }}>¡Subida Exitosa!</h1>
        <p>Tu archivo de <strong>{taskData.name}</strong> ha sido cargado con éxito. Escanea el código QR para acceder directo al trabajo.</p>
      </div>

      <div className="qr-container" style={{ textAlign: 'center' }}>
        <QRCodeSVG 
          value={externalLink} 
          size={200}
          fgColor="#0f1c3f"
          bgColor="#ffffff"
          level="H"
          includeMargin={true}
          style={{ margin: '0 auto' }}
        />
      </div>

      <div style={{ textAlign: 'left', marginTop: '1.5rem' }}>
        <label className="form-label" style={{ fontWeight: '600' }}>Enlace Directo al Trabajo</label>
        <div className="copy-link-box">
          <input 
            type="text" 
            readOnly 
            value={externalLink} 
          />
          <button onClick={() => copyToClipboard(externalLink)} type="button" title="Copiar enlace">
            {copied ? <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>¡Copiado!</span> : <Copy size={18} />}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexDirection: 'column' }}>
        <a href={externalLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <ExternalLink size={18} /> {taskData.type === 'file' ? 'Descargar Archivo' : 'Acceder al Enlace'}
        </a>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to={`/materia/${encodeURIComponent(taskData.subject)}`} className="btn btn-outline" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={18} /> Nueva Entrega
          </Link>
          <Link to={`/task/${taskData.id}`} className="btn btn-outline" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
             Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TaskSuccess;
