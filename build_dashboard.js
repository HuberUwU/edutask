import fs from 'fs';

let content = fs.readFileSync('src/pages/Dashboard.jsx', 'utf-8');

const replacement = `<div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {/* Agrupar tareas por materia */}
                  {Array.from(new Set(filteredTasks.map(t => t.subject || 'Sin materia'))).map(subjectName => {
                    const subjectTasks = filteredTasks.filter(t => (t.subject || 'Sin materia') === subjectName);
                    return (
                      <div key={subjectName} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)' }}>
                        <div style={{ background: 'var(--primary)', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                          <h3 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Book size={20} /> {subjectName}
                          </h3>
                          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                            {subjectTasks.length} trabajos
                          </span>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {subjectTasks.map(task => (
                              <div key={task.id} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                  <div>
                                    <span style={{ background: '#e2e8f0', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', display: 'inline-block', marginBottom: '0.5rem' }}>
                                      #{task.id.toUpperCase()}
                                    </span>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)', fontSize: '1.1rem' }}>{task.name}</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                      <Calendar size={14} /> {task.date.split(',')[0]}
                                    </div>
                                  </div>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', flex: 1 }}>
                                  {task.description || 'Sin notas adicionales'}
                                </p>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                                  <a 
                                    href={task.fileName} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn btn-primary" 
                                    style={{ padding: '0.5rem', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}
                                    title={task.type === 'file' ? "Descargar Archivo" : "Abrir Enlace Externo"}
                                  >
                                    <LinkIcon size={16} style={{ marginRight: '0.25rem' }} /> Ver
                                  </a>
                                  <Link 
                                    to={\`/task/\${task.id}\`} 
                                    className="btn btn-outline" 
                                    style={{ padding: '0.5rem', width: 'auto', background: 'white' }}
                                    title="Ver Detalles Completos"
                                  >
                                    <Eye size={16} />
                                  </Link>
                                  <button 
                                    className="btn btn-outline" 
                                    style={{ padding: '0.5rem', width: 'auto', color: '#dc2626', borderColor: '#fca5a5', background: 'white' }}
                                    onClick={() => handleRemoveTask(task.id, task.fileName)}
                                    title="Eliminar Trabajo Permanentemente"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>`;

content = content.replace(/<div style={{ overflowX: 'auto' }}>[\s\S]*?<\/table>\s*<\/div>/, replacement);

fs.writeFileSync('src/pages/Dashboard.jsx', content);
