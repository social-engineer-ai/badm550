"use client";
import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';

export default function TeamsPage() {
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTeam, setSelectedTeam] = useState<any>(null);
    const [auditData, setAuditData] = useState<any>(null);

    const fetchTeams = async () => {
        try {
            const data = await apiRequest('/instructor/teams');
            setTeams(data);
        } catch (err) {
            console.error("Failed to fetch teams", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const handleAudit = async (team: any) => {
        setSelectedTeam(team);
        setAuditData(null);
        try {
            const data = await apiRequest(`/instructor/teams/${team.id}/audit`);
            setAuditData(data);
        } catch (err) {
            alert("Failed to load audit trail.");
        }
    };

    const updateHealth = async (status: string) => {
        if (!selectedTeam) return;
        try {
            await apiRequest(`/instructor/teams/${selectedTeam.id}/health?status=${status}`, { method: 'POST' });
            setTeams(teams.map(t => t.id === selectedTeam.id ? { ...t, health_status: status } : t));
            setSelectedTeam({ ...selectedTeam, health_status: status });
            alert(`Manual override: Team health set to ${status}`);
        } catch (err) {
            alert("Failed to update health.");
        }
    };

    const filteredTeams = teams.filter(team =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.project?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="app-container">
            <div className="main-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p className="text-secondary animate-pulse">Accessing Team Rosters...</p>
            </div>
        </div>
    );

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div style={{ marginBottom: '3rem' }}>
                    <h2 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>BADM 550</h2>
                    <p style={{ fontSize: '0.75rem', fontWeight: 500 }}>EXECUTIVE TERMINAL</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <a href="/instructor" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        📊 Dashboard
                    </a>
                    <a href="/instructor/teams" className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--accent-secondary)' }}>
                        👥 Team Roster
                    </a>
                    <a href="/instructor/roadmap" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        🎯 Roadmap
                    </a>
                </nav>
            </aside>

            <main className="main-view animate-fade-in">
                <header style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>Team <span className="text-gradient">Registry</span></h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Managing <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{teams.length}</span> active student cohorts.
                    </p>
                </header>

                <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Search by team or project..."
                        className="glass-card"
                        style={{ flex: 1, background: 'var(--bg-darker)', padding: '16px', color: 'white', fontSize: '1rem' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="btn btn-secondary" style={{ padding: '0 2rem' }}>Export Audit Trail</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
                    {filteredTeams.map(team => (
                        <div key={team.id} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{team.name}</h2>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--accent-secondary)' }}>{team.project?.name || 'Unassigned Project'}</p>
                                </div>
                                <span className={`badge ${team.health_status === 'red' ? 'badge-danger' : team.health_status === 'yellow' ? 'badge-warning' : 'badge-success'}`}>
                                    {team.health_status.toUpperCase()}
                                </span>
                            </div>

                            <div style={{ marginBottom: '1.5rem', flex: 1 }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 700 }}>ROSTER MEMBERS</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {team.memberships?.map((m: any) => (
                                        <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <div style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    background: 'var(--bg-elevated)',
                                                    borderRadius: '10px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 700,
                                                    border: '1px solid var(--border-light)'
                                                }}>
                                                    {m.student?.user?.first_name?.[0]}{m.student?.user?.last_name?.[0]}
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>{m.student?.user?.first_name} {m.student?.user?.last_name}</p>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.role || 'Member'}</p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className="btn btn-ghost" style={{ padding: '6px', fontSize: '1rem' }} title="Profile">👤</button>
                                                <button className="btn btn-ghost" style={{ padding: '6px', fontSize: '1rem' }} title="Mail">✉️</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button onClick={() => handleAudit(team)} className="btn btn-primary" style={{ flex: 1, padding: '12px', fontSize: '0.85rem' }}>Audit Team Trail</button>
                                <button className="btn btn-ghost" style={{ flex: 1, padding: '12px', fontSize: '0.85rem' }}>Project Config</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Audit Modal */}
                {selectedTeam && (
                    <div className="modal-overlay" style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }} onClick={() => setSelectedTeam(null)}>
                        <div className="glass-card modal-content" style={{
                            width: '90%', maxWidth: '1000px', height: '80vh', overflowY: 'auto',
                            padding: '3rem', position: 'relative'
                        }} onClick={e => e.stopPropagation()}>

                            <button onClick={() => setSelectedTeam(null)} style={{
                                position: 'absolute', top: '1.5rem', right: '1.5rem',
                                background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer'
                            }}>✕</button>

                            <header style={{ marginBottom: '3rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <div>
                                        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{selectedTeam.name} <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>Audit</span></h2>
                                        <p style={{ color: 'var(--accent-secondary)' }}>Project: {selectedTeam.project?.name}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => updateHealth('green')} className="btn btn-ghost" style={{ border: '1px solid var(--success)', color: 'var(--success)' }}>Set Green</button>
                                        <button onClick={() => updateHealth('yellow')} className="btn btn-ghost" style={{ border: '1px solid var(--warning)', color: 'var(--warning)' }}>Set Yellow</button>
                                        <button onClick={() => updateHealth('red')} className="btn btn-ghost" style={{ border: '1px solid var(--danger)', color: 'var(--danger)' }}>Set Red</button>
                                    </div>
                                </div>
                            </header>

                            {!auditData ? (
                                <p className="animate-pulse">Loading Audit Trail...</p>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                                    {/* Left: Alerts & Sentiment */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                        <section>
                                            <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>ALERT HISTORY</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                {auditData.alerts.length === 0 ? <p style={{ fontSize: '0.9rem', opacity: 0.5 }}>No alerts found for this team.</p> :
                                                    auditData.alerts.map((alert: any) => (
                                                        <div key={alert.id} className="glass-card" style={{ padding: '1rem', borderLeft: `3px solid ${alert.priority === 'high' ? 'var(--danger)' : 'var(--warning)'}` }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                                <span className="badge badge-info" style={{ fontSize: '0.6rem' }}>{alert.type.toUpperCase()}</span>
                                                                <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{new Date(alert.created_at).toLocaleDateString()}</span>
                                                            </div>
                                                            <p style={{ fontSize: '0.85rem' }}>{alert.message}</p>
                                                        </div>
                                                    ))}
                                            </div>
                                        </section>

                                        <section>
                                            <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>SENTIMENT PULSE (RECENT)</h3>
                                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                                                {auditData.pulse_history.map((p: any) => (
                                                    <div key={p.id} className="glass-card" style={{ padding: '0.75rem', textAlign: 'center', minWidth: '60px' }}>
                                                        <p style={{ fontSize: '1.5rem' }}>{p.sentiment}</p>
                                                        <p style={{ fontSize: '0.6rem', opacity: 0.6, marginTop: '4px' }}>{new Date(p.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                                                    </div>
                                                ))}
                                                {auditData.pulse_history.length === 0 && <p style={{ fontSize: '0.9rem', opacity: 0.5 }}>No pulse data detected.</p>}
                                            </div>
                                        </section>

                                        <section>
                                            <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>OFFICE HOURS / MEETINGS</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                {auditData.meetings?.length === 0 ? <p style={{ fontSize: '0.9rem', opacity: 0.5 }}>No meetings requested.</p> :
                                                    auditData.meetings?.map((m: any) => (
                                                        <div key={m.id} className="glass-card" style={{ padding: '1rem' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                                <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{m.status.toUpperCase()}</span>
                                                                <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{m.duration} mins</span>
                                                            </div>
                                                            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{m.topic}</p>
                                                            <p style={{ fontSize: '0.8rem', marginTop: '4px', opacity: 0.7 }}>{m.description}</p>
                                                        </div>
                                                    ))}
                                            </div>
                                        </section>
                                    </div>

                                    {/* Right: Submission History & Frustrations */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                        <section>
                                            <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>FRICTION REPORTS (CONFIDENTIAL)</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                {auditData.frustrations?.length === 0 ? <p style={{ fontSize: '0.9rem', opacity: 0.5 }}>No feedback reported.</p> :
                                                    auditData.frustrations?.map((f: any) => (
                                                        <div key={f.id} className="glass-card" style={{ padding: '1rem', borderLeft: `3px solid ${f.impact_level === 'critical' ? 'var(--danger)' : 'var(--warning)'}` }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>{f.category.toUpperCase()}</span>
                                                                <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{f.is_anonymous ? 'Anonymous' : 'Direct'}</span>
                                                            </div>
                                                            <p style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>"{f.message}"</p>
                                                        </div>
                                                    ))}
                                            </div>
                                        </section>

                                        <section>
                                            <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>SUBMISSION LOG</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                                {auditData.submissions.map((sub: any) => (
                                                    <div key={sub.id} className="glass-card" style={{ padding: '1.5rem' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                            <h4 style={{ fontSize: '1rem' }}>Week {sub.week?.week_number || '?'}: {sub.file_url}</h4>
                                                            <span className={`badge ${sub.status === 'approved' ? 'badge-success' : 'badge-danger'}`}>{sub.status}</span>
                                                        </div>
                                                        {sub.auto_eval_result && (
                                                            <div style={{ background: 'var(--bg-darker)', padding: '1rem', borderRadius: '8px' }}>
                                                                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>AI FEEDBACK</p>
                                                                <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>{sub.auto_eval_result.feedback}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                {auditData.submissions.length === 0 && <p style={{ fontSize: '0.9rem', opacity: 0.5 }}>No submissions recorded.</p>}
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
