import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UploadCloud, File, X, Loader2, ArrowLeft, FileText, Link as LinkIcon } from 'lucide-react';
import { rtdb } from '../firebase';

function Upload() {
  const [linkUrl, setLinkUrl] = useState('');
  
  // States
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  
  const [isUploading, setIsUploading] = useState(false);
  
  const navigate = useNavigate();

  // Load available teachers and original subjects
  useEffect(() => {
    const storedSubjects = localStorage.getItem('cobaem_subjects');
    if (storedSubjects) {
      setSubjects(JSON.parse(storedSubjects));
    } else {
      const defaultSubjects = ['Matemáticas I', 'Taller de Lectura y Redacción', 'Química Básica', 'Informática'];
      setSubjects(defaultSubjects);
      localStorage.setItem('cobaem_subjects', JSON.stringify(defaultSubjects));
    }

    const storedTeachers = localStorage.getItem('cobaem_teachers_v2');
    if (storedTeachers) {
      setTeachers(JSON.parse(storedTeachers));
    } else {
      const defaultTeachers = [
        { name: 'Ing. Juan Carlos López', subjects: ['Matemáticas I', 'Informática'] },
        { name: 'Lic. María Elena Sánchez', subjects: ['Taller de Lectura y Redacción'] },
        { name: 'Mtro. Pedro Gutiérrez', subjects: ['Química Básica'] }
      ];
      setTeachers(defaultTeachers);
      localStorage.setItem('cobaem_teachers_v2', JSON.stringify(defaultTeachers));
    }
  }, []);

  // When teacher changes, filter their subjects 
  useEffect(() => {
    if (selectedTeacher) {
      const teacherObj = teachers.find(t => t.name === selectedTeacher);
      if (teacherObj && teacherObj.subjects && teacherObj.subjects.length > 0) {
        setAvailableSubjects(teacherObj.subjects);
      } else {
        setAvailableSubjects([]);
      }
      setSelectedSubject(''); // reset previous selection
    } else {
      setAvailableSubjects([]);
    }
  }, [selectedTeacher, teachers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskName || !selectedSubject || !selectedTeacher || !linkUrl) return;

    setIsUploading(true);
    
    try {
      const taskId = Math.random().toString(36).substring(2, 10);
      
      const taskData = {
        id: taskId,
        name: taskName,
        subject: selectedSubject,
        teacher: selectedTeacher,
        description,
        type: 'link',
        fileName: linkUrl,
        fileSize: 'Enlace',
        date: new Date().toLocaleDateString('es-MX', { 
          year: 'numeric', month: 'long', day: 'numeric',
          hour: '2-digit', minute:'2-digit'
        })
      };

      // Guardamos la tarea en firebase bajo la ruta "tasks/" + taskId
      await rtdb.setWithId(`tasks/task_${taskId}`, taskData);
      
      setIsUploading(false);
      navigate(`/success/${taskId}`);
    } catch (error) {
      console.error("Error al guardar la tarea en Firebase:", error);
      setIsUploading(false);
      alert("Hubo un error al guardar la tarea. Revisa tu conexión.");
    }
  };

  return (
    <div className="upload-section animate-fade-in" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/" className="btn btn-outline" style={{ display: 'inline-flex', width: 'auto', background: 'white' }}>
            <ArrowLeft size={18} /> Volver
          </Link>
        </div>

        <div className="auth-card" style={{ margin: '0 auto' }}>
          <div className="header">
            <h2 style={{ color: 'var(--primary)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Subir Nueva Tarea</h2>
            <p>Completa el formulario y adjunta tu archivo para generar tu comprobante y código QR.</p>
          </div>

          <form onSubmit={handleSubmit}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
              
              <div className="form-group">
                <label className="form-label" htmlFor="teacher">Profesor</label>
                <select 
                  id="teacher"
                  className="form-control"
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  required
                >
                  <option value="" disabled>-- Seleccione Docente --</option>
                  {teachers.map((prof, idx) => (
                    <option key={idx} value={prof.name}>{prof.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subject">Materia</label>
                <select 
                  id="subject"
                  className="form-control"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  required
                  disabled={!selectedTeacher || availableSubjects.length === 0}
                >
                  <option value="" disabled>-- Selecciona la Materia --</option>
                  {availableSubjects.map((sub, idx) => (
                    <option key={idx} value={sub}>{sub}</option>
                  ))}
                </select>
                {selectedTeacher && availableSubjects.length === 0 && (
                  <div style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                    Este profesor no tiene materias asignadas.
                  </div>
                )}
              </div>
            </div>

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
              disabled={!taskName || !selectedSubject || !selectedTeacher || !linkUrl || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="loader" size={20} style={{ display: 'inline-block', marginRight: '8px' }} /> Procesando archivo...
                </>
              ) : (
                'Finalizar Entrega'
              )}
            </button>
          </form>
        </div>
      </div>
      <style>{`
        select option { color: initial; }
        .form-control:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(92, 27, 51, 0.2); }
      `}</style>
    </div>
  );
}

export default Upload;
