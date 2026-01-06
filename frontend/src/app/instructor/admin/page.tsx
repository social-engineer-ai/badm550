"use client";
import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';

type Tab = 'projects' | 'teams' | 'students' | 'tas';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<Tab>('projects');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    // Data states
    const [semesters, setSemesters] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [tas, setTas] = useState<any[]>([]);

    // Form states
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<any>({});

    const fetchData = async () => {
        try {
            const [userData, semData, projData, teamData, studData, taData] = await Promise.all([
                apiRequest('/auth/me'),
                apiRequest('/admin/semesters'),
                apiRequest('/admin/projects'),
                apiRequest('/admin/teams'),
                apiRequest('/admin/students'),
                apiRequest('/admin/tas')
            ]);
            setUser(userData);
            setSemesters(semData);
            setProjects(projData);
            setTeams(teamData);
            setStudents(studData);
            setTas(taData);
        } catch (err) {
            console.error("Failed to fetch admin data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ============== HANDLERS ==============

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiRequest('/admin/projects', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            setShowForm(false);
            setFormData({});
            fetchData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiRequest('/admin/teams', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            setShowForm(false);
            setFormData({});
            fetchData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleCreateStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiRequest('/admin/students', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            setShowForm(false);
            setFormData({});
            fetchData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleCreateTA = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiRequest('/admin/tas', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            setShowForm(false);
            setFormData({});
            fetchData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDeleteProject = async (id: number) => {
        if (!confirm("Delete this project? All teams will be removed.")) return;
        await apiRequest(`/admin/projects/${id}`, { method: 'DELETE' });
        fetchData();
    };

    const handleDeleteTeam = async (id: number) => {
        if (!confirm("Delete this team?")) return;
        await apiRequest(`/admin/teams/${id}`, { method: 'DELETE' });
        fetchData();
    };

    const handleDeleteStudent = async (id: number) => {
        if (!confirm("Delete this student?")) return;
        await apiRequest(`/admin/students/${id}`, { method: 'DELETE' });
        fetchData();
    };

    const handleDeleteTA = async (id: number) => {
        if (!confirm("Delete this TA?")) return;
        await apiRequest(`/admin/tas/${id}`, { method: 'DELETE' });
        fetchData();
    };

    const handleAssignToTeam = async (studentId: number, teamId: number) => {
        try {
            await apiRequest(`/admin/teams/${teamId}/members`, {
                method: 'POST',
                body: JSON.stringify({ student_id: studentId, role: 'member' })
            });
            fetchData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleRemoveFromTeam = async (studentId: number, teamId: number) => {
        try {
            await apiRequest(`/admin/teams/${teamId}/members/${studentId}`, { method: 'DELETE' });
            fetchData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (loading) return (
        <div className="app-container">
            <div className="main-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p className="text-secondary animate-pulse">Loading Admin Panel...</p>
            </div>
        </div>
    );

    const inputStyle = {
        width: '100%',
        background: 'var(--bg-darker)',
        padding: '12px',
        marginTop: '6px',
        color: 'white',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle)'
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div style={{ marginBottom: '3rem' }}>
                    <h2 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>BADM 550</h2>
                    <p style={{ fontSize: '0.75rem', fontWeight: 500 }}>ADMIN PANEL</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <a href="/instructor" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        📊 Dashboard
                    </a>
                    <a href="/instructor/teams" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        👥 Team Roster
                    </a>
                    <a href="/instructor/gradebook" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        📝 Gradebook
                    </a>
                    <a href="/instructor/roadmap" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        🎯 Roadmap
                    </a>
                    <a href="/instructor/admin" className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--accent-secondary)' }}>
                        ⚙️ Admin
                    </a>
                </nav>

                <div className="glass-card" style={{ padding: '1rem', marginTop: 'auto' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Logged in as</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600 }}>{user?.first_name} ({user?.role?.toUpperCase()})</p>
                </div>
            </aside>

            <main className="main-view animate-fade-in">
                <header style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Course Administration</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage projects, teams, students, and teaching assistants</p>
                </header>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                    {(['projects', 'teams', 'students', 'tas'] as Tab[]).map(tab => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setShowForm(false); }}
                            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-ghost'}`}
                            style={{ textTransform: 'capitalize' }}
                        >
                            {tab === 'tas' ? 'Teaching Assistants' : tab}
                        </button>
                    ))}
                </div>

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem' }}>Projects ({projects.length})</h2>
                            <button onClick={() => setShowForm(true)} className="btn btn-secondary">+ New Project</button>
                        </div>

                        {showForm && (
                            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                                <h3 style={{ marginBottom: '1.5rem' }}>Create New Project</h3>
                                <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>PROJECT NAME</label>
                                        <input required style={inputStyle} value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. AWG Price Gap Analysis" />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>SEMESTER</label>
                                        <select required style={inputStyle} value={formData.semester_id || ''} onChange={e => setFormData({...formData, semester_id: parseInt(e.target.value)})}>
                                            <option value="">Select Semester</option>
                                            {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>TYPE</label>
                                        <select style={inputStyle} value={formData.type || 'structured'} onChange={e => setFormData({...formData, type: e.target.value})}>
                                            <option value="structured">Structured</option>
                                            <option value="unstructured">Unstructured</option>
                                            <option value="simulated">Simulated</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>CLIENT NAME</label>
                                        <input style={inputStyle} value={formData.client_name || ''} onChange={e => setFormData({...formData, client_name: e.target.value})} placeholder="e.g. AWG, Country Financial" />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                        <button type="submit" className="btn btn-primary">Create Project</button>
                                        <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {projects.map(proj => (
                                <div key={proj.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{proj.name}</h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            {proj.semester?.name} • {proj.type} • {proj.client_name || 'No client'}
                                        </p>
                                    </div>
                                    <button onClick={() => handleDeleteProject(proj.id)} className="btn btn-ghost" style={{ color: 'var(--danger)' }}>Delete</button>
                                </div>
                            ))}
                            {projects.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No projects yet</p>}
                        </div>
                    </section>
                )}

                {/* Teams Tab */}
                {activeTab === 'teams' && (
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem' }}>Teams ({teams.length})</h2>
                            <button onClick={() => setShowForm(true)} className="btn btn-secondary">+ New Team</button>
                        </div>

                        {showForm && (
                            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                                <h3 style={{ marginBottom: '1.5rem' }}>Create New Team</h3>
                                <form onSubmit={handleCreateTeam} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>TEAM NAME</label>
                                        <input required style={inputStyle} value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. AWG-Team-1" />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>PROJECT</label>
                                        <select required style={inputStyle} value={formData.project_id || ''} onChange={e => setFormData({...formData, project_id: parseInt(e.target.value)})}>
                                            <option value="">Select Project</option>
                                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                        <button type="submit" className="btn btn-primary">Create Team</button>
                                        <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {teams.map(team => (
                                <div key={team.id} className="glass-card" style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{team.name}</h3>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{team.project?.name}</p>
                                        </div>
                                        <button onClick={() => handleDeleteTeam(team.id)} className="btn btn-ghost" style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>Delete</button>
                                    </div>
                                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>MEMBERS ({team.memberships?.length || 0})</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {team.memberships?.map((m: any) => (
                                                <span key={m.id} className="badge badge-info" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    {m.student?.user?.first_name} {m.student?.user?.last_name}
                                                    <button onClick={() => handleRemoveFromTeam(m.student?.user?.id, team.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>×</button>
                                                </span>
                                            ))}
                                            {(!team.memberships || team.memberships.length === 0) && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No members</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {teams.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No teams yet</p>}
                        </div>
                    </section>
                )}

                {/* Students Tab */}
                {activeTab === 'students' && (
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem' }}>Students ({students.length})</h2>
                            <button onClick={() => setShowForm(true)} className="btn btn-secondary">+ Add Student</button>
                        </div>

                        {showForm && (
                            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                                <h3 style={{ marginBottom: '1.5rem' }}>Add New Student</h3>
                                <form onSubmit={handleCreateStudent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>FIRST NAME</label>
                                            <input required style={inputStyle} value={formData.first_name || ''} onChange={e => setFormData({...formData, first_name: e.target.value})} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>LAST NAME</label>
                                            <input required style={inputStyle} value={formData.last_name || ''} onChange={e => setFormData({...formData, last_name: e.target.value})} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>EMAIL</label>
                                        <input required type="email" style={inputStyle} value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="student@illinois.edu" />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>PASSWORD</label>
                                        <input required style={inputStyle} value={formData.password || 'changeme123'} onChange={e => setFormData({...formData, password: e.target.value})} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                        <button type="submit" className="btn btn-primary">Add Student</button>
                                        <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="glass-card" style={{ overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'var(--bg-elevated)', textAlign: 'left' }}>
                                        <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>NAME</th>
                                        <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>EMAIL</th>
                                        <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>TEAM</th>
                                        <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map(student => (
                                        <tr key={student.id} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                            <td style={{ padding: '1rem' }}>{student.first_name} {student.last_name}</td>
                                            <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{student.email}</td>
                                            <td style={{ padding: '1rem' }}>
                                                {student.team ? (
                                                    <span className="badge badge-success">{student.team.team_name}</span>
                                                ) : (
                                                    <select
                                                        style={{ ...inputStyle, padding: '6px 10px', marginTop: 0 }}
                                                        onChange={e => { if (e.target.value) handleAssignToTeam(student.id, parseInt(e.target.value)); }}
                                                        defaultValue=""
                                                    >
                                                        <option value="">Assign to team...</option>
                                                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                                    </select>
                                                )}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <button onClick={() => handleDeleteStudent(student.id)} className="btn btn-ghost" style={{ color: 'var(--danger)', fontSize: '0.8rem', padding: '4px 8px' }}>Remove</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {students.length === 0 && <p style={{ padding: '2rem', color: 'var(--text-muted)', textAlign: 'center' }}>No students yet</p>}
                        </div>
                    </section>
                )}

                {/* TAs Tab */}
                {activeTab === 'tas' && (
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem' }}>Teaching Assistants ({tas.length})</h2>
                            <button onClick={() => setShowForm(true)} className="btn btn-secondary">+ Add TA</button>
                        </div>

                        {showForm && (
                            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                                <h3 style={{ marginBottom: '1.5rem' }}>Add New Teaching Assistant</h3>
                                <form onSubmit={handleCreateTA} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>FIRST NAME</label>
                                            <input required style={inputStyle} value={formData.first_name || ''} onChange={e => setFormData({...formData, first_name: e.target.value})} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>LAST NAME</label>
                                            <input required style={inputStyle} value={formData.last_name || ''} onChange={e => setFormData({...formData, last_name: e.target.value})} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>EMAIL</label>
                                        <input required type="email" style={inputStyle} value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="ta@illinois.edu" />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>PASSWORD</label>
                                        <input required style={inputStyle} value={formData.password || 'changeme123'} onChange={e => setFormData({...formData, password: e.target.value})} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                        <button type="submit" className="btn btn-primary">Add TA</button>
                                        <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {tas.map(ta => (
                                <div key={ta.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{ta.first_name} {ta.last_name}</h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{ta.email}</p>
                                    </div>
                                    <button onClick={() => handleDeleteTA(ta.id)} className="btn btn-ghost" style={{ color: 'var(--danger)' }}>Remove</button>
                                </div>
                            ))}
                            {tas.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No teaching assistants yet</p>}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
