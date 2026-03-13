import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Download,
  Calendar,
  Users,
  Book,
  Plus,
  Trash2,
  CheckSquare,
  Link as LinkIcon
} from 'lucide-react';
import { db, rtdb } from '../firebase';
import { get, ref, child, set as setDb } from 'firebase/database';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks', 'teachers', 'subjects'
  
  // Data States
  const [tasks, setTasks] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  // Input States
  const [searchTerm, setSearchTerm] = useState('');
  const [newTeacher, setNewTeacher] = useState('');
  const [newTeacherSubjects, setNewTeacherSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  // Load Initial Data
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      // 1. Fetch Tasks from Firebase (Real Database)
      try {
        const fetchedTasks = await rtdb.getAll('tasks');
        if (isMounted) {
          setTasks(fetchedTasks || []);
        }
      } catch (err) {
        console.error("Error cargando tareas:", err);
      }

      // 2. Load Subjects from Firebase
      try {
        const snapS = await get(child(ref(db), 'config/subjects'));
        if (snapS.exists()) {
          if (isMounted) setSubjects(snapS.val());
        } else {
          const defS = ['Matemáticas I', 'Taller de Lectura y Redacción', 'Química Básica', 'Informática'];
          if (isMounted) setSubjects(defS);
          setDb(ref(db, 'config/subjects'), defS);
        }
      } catch (err) {
        console.error("Error cargando materias:", err);
      }

      // 3. Load Teachers from Firebase
      try {
        const snapT = await get(child(ref(db), 'config/teachers'));
        if (snapT.exists()) {
          if (isMounted) setTeachers(snapT.val());
        } else {
          const defT = [
            { name: 'Profesor Prueba', subjects: ['Matemáticas I', 'Informática'] },
          ];
          if (isMounted) setTeachers(defT);
          setDb(ref(db, 'config/teachers'), defT);
        }
      } catch (err) {
        console.error("Error cargando profesores:", err);
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    loadData();

    return () => { isMounted = false; };
  }, []);

  // Handlers for Teachers
  const handleTeacherSubjectToggle = (subject) => {
    if (newTeacherSubjects.includes(subject)) {
      setNewTeacherSubjects(newTeacherSubjects.filter(s => s !== subject));
    } else {
      setNewTeacherSubjects([...newTeacherSubjects, subject]);
    }
  };

  const handleAddTeacher = (e) => {
    e.preventDefault();
    if (!newTeacher.trim() || newTeacherSubjects.length === 0) {
      alert("Por favor ingrese el nombre y seleccione al menos una materia.");
      return;
    }
    const updated = [...teachers, { name: newTeacher.trim(), subjects: newTeacherSubjects }];
    setTeachers(updated);
    setDb(ref(db, 'config/teachers'), updated);
    setNewTeacher('');
    setNewTeacherSubjects([]);
  };

  const handleRemoveTeacher = (indexToRemove) => {
    const updated = teachers.filter((_, idx) => idx !== indexToRemove);
    setTeachers(updated);
    setDb(ref(db, 'config/teachers'), updated);
  };

  // Handlers for Subjects
  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    const updated = [...subjects, newSubject.trim()];
    setSubjects(updated);
    setDb(ref(db, 'config/subjects'), updated);
    setNewSubject('');
  };

  const handleRemoveSubject = (indexToRemove) => {
    const subjectToRemove = subjects[indexToRemove];
    const updated = subjects.filter((_, idx) => idx !== indexToRemove);
    setSubjects(updated);
    setDb(ref(db, 'config/subjects'), updated);

    // Also remove this subject from any teachers that teach it
    const updatedTeachers = teachers.map(t => ({
      ...t,
      subjects: t.subjects.filter(s => s !== subjectToRemove)
    }));
    setTeachers(updatedTeachers);
    setDb(ref(db, 'config/teachers'), updatedTeachers);
  };

  const filteredTasks = tasks.filter(task => 
    task.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.teacher && task.teacher.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (task.subject && task.subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 72px)' }}>
      {/* Admin Header */}
      <div style={{ background: 'white', padding: '2rem 1.5rem', borderBottom: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ color: 'var(--primary)', marginBottom: '0.25rem', fontSize: '2rem' }}>Panel Administrativo</h1>
            <p style={{ color: 'var(--text-muted)' }}>Gestión de Trabajos, Profesores y Materias del COBAEM</p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            <button 
              className={`btn ${activeTab === 'tasks' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('tasks')}
              style={activeTab !== 'tasks' ? { background: 'white' } : {}}
            >
              <FileText size={18} /> Trabajos ({tasks.length})
            </button>
            <button 
              className={`btn ${activeTab === 'teachers' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('teachers')}
              style={activeTab !== 'teachers' ? { background: 'white' } : {}}
            >
              <Users size={18} /> Profesores ({teachers.length})
            </button>
            <button 
              className={`btn ${activeTab === 'subjects' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('subjects')}
              style={activeTab !== 'subjects' ? { background: 'white' } : {}}
            >
              <Book size={18} /> Materias ({subjects.length})
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '2.5rem', paddingBottom: '4rem' }}>
        
        {/* --- TASKS TAB --- */}
        {activeTab === 'tasks' && (
          <>
             <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, position: 'relative', minWidth: '300px' }}>
                <Search size={20} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Buscar folio, trabajo, materia o profesor..."
                  style={{ paddingLeft: '2.8rem', backgroundColor: 'white' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn btn-outline" style={{ background: 'white' }}>
                <Filter size={18} /> Filtrar
              </button>
            </div>

            <div style={{ background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
              {isLoading ? (
                <div style={{ padding: '4rem', textAlign: 'center' }}>
                  <div className="loader" style={{ borderColor: 'var(--primary-light)', borderTopColor: 'var(--primary)', margin: '0 auto 1rem', width: '32px', height: '32px' }}></div>
                  <p style={{ color: 'var(--text-muted)' }}>Cargando registros...</p>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div style={{ padding: '4rem', textAlign: 'center' }}>
                  <FileText size={48} style={{ color: '#e5e7eb', margin: '0 auto 1rem' }} />
                  <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>No hay resultados</h3>
                  <p style={{ color: 'var(--text-muted)' }}>No se encontraron trabajos registrados.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'var(--primary-light)', borderBottom: '1px solid var(--border-color)' }}>
                      <tr>
                        <th style={{ padding: '1.2rem 1.5rem', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>Folio / Fecha</th>
                        <th style={{ padding: '1.2rem 1.5rem', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>Trabajo</th>
                        <th style={{ padding: '1.2rem 1.5rem', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>Materia y Profesor</th>
                        <th style={{ padding: '1.2rem 1.5rem', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>Archivo</th>
                        <th style={{ padding: '1.2rem 1.5rem', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', textAlign: 'right' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTasks.map((task) => (
                        <tr key={task.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} className="table-row-hover">
                          <td style={{ padding: '1.2rem 1.5rem' }}>
                            <span style={{ background: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid #e2e8f0', color: '#475569', display: 'inline-block', marginBottom: '0.5rem' }}>
                              #{task.id.toUpperCase()}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                              <Calendar size={12} /> {task.date.split(',')[0]}
                            </div>
                          </td>
                          <td style={{ padding: '1.2rem 1.5rem', maxWidth: '250px' }}>
                            <div style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {task.name}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {task.description || 'Sin notas'}
                            </div>
                          </td>
                          <td style={{ padding: '1.2rem 1.5rem', maxWidth: '200px' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                              {task.subject || 'Sin materia'}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              {task.teacher || 'Sin profesor'}
                            </div>
                          </td>
                          <td style={{ padding: '1.2rem 1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                              <LinkIcon size={16} color="var(--primary)" />
                              <span style={{ fontWeight: '500', whiteSpace: 'wrap' }} title={task.fileName}>
                                <a href={task.fileName} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                                  {task.fileName.length > 25 ? task.fileName.substring(0, 25) + '...' : task.fileName}
                                </a>
                              </span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                              {task.fileSize}
                            </div>
                          </td>
                          <td style={{ padding: '1.2rem 1.5rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                              <Link 
                                to={`/task/${task.id}`} 
                                className="btn btn-outline" 
                                style={{ padding: '0.5rem', width: 'auto', background: 'white' }}
                                title="Ver Detalles"
                              >
                                <Eye size={16} />
                              </Link>
                              <a 
                                href={task.fileName} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-primary" 
                                style={{ padding: '0.5rem', width: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                title="Abrir Enlace Externo"
                              >
                                <LinkIcon size={16} />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* --- TEACHERS TAB --- */}
        {activeTab === 'teachers' && (
          <div className="animate-fade-in">
            <div className="auth-card" style={{ maxWidth: '800px', margin: '0 auto', background: 'white' }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={24} /> Directorio de Profesores
              </h3>
              
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '1.05rem', color: 'var(--text-main)' }}>Agregar Nuevo Profesor</h4>
                
                {subjects.length === 0 ? (
                  <div style={{ color: '#b91c1c', fontSize: '0.9rem', padding: '1rem', background: '#fee2e2', borderRadius: '6px' }}>
                    Agregue primero al menos una materia en la pestaña de Materias.
                  </div>
                ) : (
                  <form onSubmit={handleAddTeacher}>
                    <div className="form-group">
                      <label className="form-label">Nombre del Docente</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Ej. Ing. Laura Gómez" 
                        value={newTeacher}
                        onChange={(e) => setNewTeacher(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                      <label className="form-label">Materias que Imparte</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
                        {subjects.map((subject, idx) => (
                          <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                            <input 
                              type="checkbox" 
                              checked={newTeacherSubjects.includes(subject)}
                              onChange={() => handleTeacherSubjectToggle(subject)}
                              style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                            />
                            {subject}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={!newTeacher.trim() || newTeacherSubjects.length === 0}>
                      <Plus size={18} /> Registrar Profesor
                    </button>
                  </form>
                )}
              </div>

              <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                {teachers.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No hay profesores registrados.</div>
                ) : (
                  teachers.map((teacher, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: index < teachers.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--primary)', marginBottom: '0.25rem' }}>{teacher.name}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {teacher.subjects && teacher.subjects.map((sub, sidx) => (
                            <span key={sidx} style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.05)' }}>
                              {sub}
                            </span>
                          ))}
                          {(!teacher.subjects || teacher.subjects.length === 0) && (
                            <span style={{ fontSize: '0.8rem', color: '#dc2626' }}>Sin materias asignadas</span>
                          )}
                        </div>
                      </div>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '0.5rem', width: 'auto', color: '#dc2626', borderColor: '#fca5a5' }}
                        onClick={() => handleRemoveTeacher(index)}
                        title="Eliminar Docente"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- SUBJECTS TAB --- */}
        {activeTab === 'subjects' && (
          <div className="animate-fade-in">
            <div className="auth-card" style={{ maxWidth: '800px', margin: '0 auto', background: 'white' }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Book size={24} /> Catálogo de Materias
              </h3>
              
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
                <form onSubmit={handleAddSubject} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <label className="form-label" style={{ marginBottom: '0.5rem' }}>Añadir Nueva Materia</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Ej. Física II" 
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: 'auto', whiteSpace: 'nowrap', height: '42px' }} disabled={!newSubject.trim()}>
                    <Plus size={18} /> Agregar
                  </button>
                </form>
              </div>

              <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                {subjects.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No hay materias registradas.</div>
                ) : (
                  subjects.map((subject, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: index < subjects.length - 1 ? '1px solid var(--border-color)' : 'none', background: 'white' }}>
                      <span style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckSquare size={16} style={{ color: 'var(--primary)' }} /> {subject}
                      </span>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '0.4rem', width: 'auto', color: '#dc2626', borderColor: '#fca5a5' }}
                        onClick={() => handleRemoveSubject(index)}
                        title="Eliminar Materia"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>
      <style>{`
        .table-row-hover:hover {
          background-color: #f8fafc;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
