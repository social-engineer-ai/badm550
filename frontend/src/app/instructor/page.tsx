"use client";
import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';

export default function InstructorDashboard() {
    const [alerts, setAlerts] = useState<any[]>([]);
    const [drafts, setDrafts] = useState<any[]>([]);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [teamsHealth, setTeamsHealth] = useState<any[]>([]);
    const [digest, setDigest] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    const fetchData = async () => {
        try {
            const [alertsData, draftsData, healthData, subsData, userData] = await Promise.all([
                apiRequest('/instructor/alerts'),
                apiRequest('/instructor/drafts'),
                apiRequest('/instructor/teams/health'),
                apiRequest('/instructor/submissions'),
                apiRequest('/auth/me')
            ]);
            setAlerts(alertsData);
            setDrafts(draftsData);
            setTeamsHealth(healthData);
            setSubmissions(subsData || []);
            setUser(userData);
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSendEmail = async (id: number) => {
        try {
            await apiRequest(`/instructor/drafts/${id}/send`, { method: 'POST' });
            setDrafts(prev => prev.filter(d => d.id !== id));
        } catch (err) {
            alert("Failed to send email via Gmail");
        }
    };

    const handleSubAction = async (id: number, action: string) => {
        try {
            await apiRequest(`/instructor/submissions/${id}/action?action=${action}`, { method: 'POST' });
            setSubmissions(prev => prev.filter(s => s.id !== id));
            fetchData();
        } catch (err) {
            alert("Failed to process submission");
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            const response = await apiRequest('/instructor/sync', { method: 'POST' });
            if (response.analysis) setDigest(response.analysis);
            await fetchData();
        } catch (err) {
            alert("Sync failed. Ensure your Google OAuth credentials are correct.");
        } finally {
            setSyncing(false);
        }
    };

    if (loading) return (
        <div className="app-container">
            <div className="main-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p className="text-secondary animate-pulse">Initializing Command Center...</p>
            </div>
        </div>
    );

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div style={{ marginBottom: '3rem' }}>
                    <h2 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>BADM 550</h2>
                    <p style={{ fontSize: '0.75rem', fontWeight: 500 }}>{user?.role === 'ta' ? 'OPERATIONS PANEL' : 'EXECUTIVE TERMINAL'}</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <a href="/instructor" className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--accent-secondary)' }}>
                        Dashboard
                    </a>
                    <a href="/instructor/projects" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        Projects
                    </a>
                    <a href="/instructor/teams" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        Team Roster
                    </a>
                    <a href="/instructor/gradebook" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        Gradebook
                    </a>
                    {user?.role !== 'ta' && (
                        <>
                            <a href="/instructor/roadmap" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                                Roadmap
                            </a>
                            <a href="/instructor/admin" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                                Admin
                            </a>
                        </>
                    )}
                </nav>


                <div className="glass-card" style={{ padding: '1rem', marginTop: 'auto' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Logged in as</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600 }}>{user?.first_name} ({user?.role?.toUpperCase()})</p>
                </div>
            </aside>

            <main className="main-view animate-fade-in">
                <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>{user?.role === 'ta' ? 'Operational Hub' : 'Cohort Insight'}</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                            Orchestrating <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{alerts.length + drafts.length + submissions.length}</span> pending actions.
                        </p>
                    </div>
                    {user?.role !== 'ta' && (
                        <button
                            onClick={handleSync}
                            disabled={syncing}
                            className="btn btn-primary"
                            style={{ padding: '14px 28px', fontSize: '0.9rem' }}
                        >
                            {syncing ? 'SYNCING...' : '🔄 SYNC PULSE'}
                        </button>
                    )}
                </header>

                {digest && (
                    <div className="glass-card animate-slide-in" style={{ padding: '2rem', marginBottom: '3rem', border: '1px solid var(--accent-primary)', background: 'linear-gradient(135deg, var(--bg-elevated) 0%, var(--accent-soft) 100%)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.5rem' }}>✨</span>
                                <h3 style={{ fontSize: '1.25rem' }}>Daily Executive Summary</h3>
                            </div>
                            <button onClick={() => setDigest(null)} className="btn btn-ghost" style={{ padding: '4px' }}>✕</button>
                        </div>
                        <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                            {digest.daily_digest}
                        </p>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>SENTIMENT SCORE</span>
                                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--success)' }}>{digest.daily_statistics?.sentiment_score}/10</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>URGENT ITEMS</span>
                                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--danger)' }}>{digest.urgent_alerts?.length || 0}</span>
                            </div>
                        </div>
                    </div>
                )}


                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>ACTIVE ALERTS</p>
                        <p style={{ fontSize: '2rem', fontWeight: 700 }}>{alerts.length}</p>
                    </div>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>PENDING REVIEWS</p>
                        <p style={{ fontSize: '2rem', fontWeight: 700 }}>{submissions.length}</p>
                    </div>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>DRAFT QUEUE</p>
                        <p style={{ fontSize: '2rem', fontWeight: 700 }}>{drafts.length}</p>
                    </div>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>AVG HEALTH</p>
                        <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>Optimal</p>
                    </div>
                </div>

                {/* Team Health Heatmap */}
                <section className="glass-card" style={{ padding: '2rem', marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem' }}>Cohort Health Heatmap</h2>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span> Optimal</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></span> Strained</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span> Critical</span>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                        {teamsHealth.map(team => (
                            <div
                                key={team.id}
                                className="glass-card"
                                style={{
                                    padding: '1rem',
                                    borderLeft: `4px solid ${team.status === 'red' ? '#ef4444' : team.status === 'yellow' ? '#f59e0b' : 'var(--success)'}`,
                                    transition: 'var(--transition-base)',
                                    cursor: 'help'
                                }}
                            >
                                <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>{team.name}</p>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                    {team.alert_count > 0 ? `${team.alert_count} Alerts` : 'Stable'}
                                </p>
                                <p style={{ fontSize: '0.7rem', color: team.sentiment === 'strained' ? '#f59e0b' : 'var(--text-muted)' }}>
                                    Sentiment: {team.sentiment}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '2.5rem' }}>
                    {/* Alerts Column */}
                    <section>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Active Alerts</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {alerts.map(alert => (
                                <div key={alert.id} className="glass-card" style={{ padding: '1.25rem', borderLeft: `3px solid ${alert.priority === 'high' ? '#ef4444' : '#f59e0b'}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span className={`badge ${alert.priority === 'high' ? 'badge-danger' : 'badge-warning'}`}>
                                            {alert.type.toUpperCase()}
                                        </span>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                            {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{alert.message}</p>
                                    {alert.ai_hypothesis && (
                                        <div style={{ background: 'var(--accent-soft)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>AI HYPOTHESIS</p>
                                            <p style={{ fontSize: '0.8rem' }}>{alert.ai_hypothesis}</p>
                                        </div>
                                    )}
                                    <button className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Resolve</button>
                                </div>
                            ))}
                            {alerts.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>No active alerts</p>}
                        </div>
                    </section>

                    {/* Submissions Review Column */}
                    <section>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Pending Reviews</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {submissions.map(sub => (
                                <div key={sub.id} className="glass-card" style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>TEAM {sub.team?.name}</span>
                                        <span className={`badge ${sub.status === 'flagged' ? 'badge-danger' : 'badge-info'}`}>
                                            WEEK {sub.week?.week_number}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{sub.file_url}</p>

                                    {sub.auto_eval_result && (
                                        <div style={{
                                            background: sub.status === 'flagged' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            marginBottom: '1rem',
                                            border: `1px solid ${sub.status === 'flagged' ? '#ef4444' : '#10b981'}`
                                        }}>
                                            <p style={{ fontSize: '0.7rem', fontWeight: 700, marginBottom: '2px' }}>AI AUTO-EVAL: {sub.auto_eval_result.status?.toUpperCase()}</p>
                                            <p style={{ fontSize: '0.75rem' }}>{sub.auto_eval_result.feedback || sub.auto_eval_result.flags?.join(', ')}</p>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => handleSubAction(sub.id, 'approve')}
                                            className="btn btn-primary"
                                            style={{ fontSize: '0.75rem', padding: '6px 12px', flex: 1 }}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleSubAction(sub.id, 'flag')}
                                            className="btn btn-ghost"
                                            style={{ fontSize: '0.75rem', padding: '6px 12px', flex: 1 }}
                                        >
                                            Flag
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {submissions.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>No pending reviews</p>}
                        </div>
                    </section>

                    {/* AI Draft Queue Column */}
                    <section>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>AI Draft Queue</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {drafts.map(draft => (
                                <div key={draft.id} className="glass-card" style={{ padding: '1.25rem' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>RE: {draft.subject}</p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>{draft.body.substring(0, 100)}...</p>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => handleSendEmail(draft.id)} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '6px 12px', flex: 1 }}>Send</button>
                                        <button className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '6px 12px', flex: 1 }}>Edit</button>
                                    </div>
                                </div>
                            ))}
                            {drafts.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>No pending drafts</p>}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
