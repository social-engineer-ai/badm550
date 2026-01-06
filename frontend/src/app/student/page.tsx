"use client";
import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';

export default function StudentDashboard() {
    const [weeks, setWeeks] = useState<any[]>([]);
    const [team, setTeam] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ subject: '', body: '' });
    const [sending, setSending] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const [weeksData, teamData] = await Promise.all([
                    apiRequest('/students/weeks'),
                    apiRequest('/students/me/team')
                ]);
                setWeeks(weeksData);
                setTeam(teamData);
            } catch (err) {
                console.error("Failed to fetch student data", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const [syncing, setSyncing] = useState(false);

    const handleUpload = async (file: File) => {
        setSyncing(true);
        try {
            // In a real app, we'd use FormData to send the file
            // For now, we simulate the submission
            const response: any = await apiRequest('/students/submit', {
                method: 'POST',
                body: JSON.stringify({ filename: file.name, week_number: 4 })
            });

            if (response.auto_eval_result?.status === 'flagged') {
                alert(`⚠️ SUBMISSION FLAGGED:\n\n${response.auto_eval_result.flags.join('\n')}\n\nPlease revise and re-upload.`);
            } else {
                alert(`✅ SUBMISSION PASSED:\n\n${response.auto_eval_result?.feedback || 'Well done! Your analysis meets core requirements.'}`);
            }
        } catch (err) {
            alert("Upload failed. Ensure backend is running and AI service is configured.");
        } finally {
            setSyncing(false);
        }
    };

    const [sentiment, setSentiment] = useState('');
    const [pulseFeedback, setPulseFeedback] = useState('');

    const handlePulse = async () => {
        if (!sentiment) return alert("Please select an emoji.");
        try {
            await apiRequest('/students/pulse', {
                method: 'POST',
                body: JSON.stringify({ sentiment, feedback: pulseFeedback })
            });
            alert("Pulse captured. Thank you!");
            setPulseFeedback('');
            setSentiment('');
        } catch (err) {
            alert("Failed to submit pulse.");
        }
    };

    const handleContact = async (e: React.FormEvent) => {


        e.preventDefault();
        setSending(true);
        try {
            await apiRequest('/students/contact', {
                method: 'POST',
                body: JSON.stringify(message)
            });
            alert("Message sent to Professor!");
            setMessage({ subject: '', body: '' });
        } catch (err) {
            alert("Failed to send message.");
        } finally {
            setSending(false);
        }
    };

    if (loading) return (
        <div className="app-container">
            <div className="main-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p className="text-secondary animate-pulse">Loading your journey...</p>
            </div>
        </div>
    );

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div style={{ marginBottom: '3rem' }}>
                    <h2 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>BADM 550</h2>
                    <p style={{ fontSize: '0.75rem', fontWeight: 500 }}>STUDENT PORTAL</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <a href="/student" className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--accent-secondary)' }}>
                        Home
                    </a>
                    <a href="/student/projects" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        Projects
                    </a>
                    <a href="/student/team" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        My Team
                    </a>
                    <a href="#" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        Grades
                    </a>
                    <a href="#" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        Help
                    </a>
                </nav>

                <div className="glass-card" style={{ padding: '1.25rem', marginTop: 'auto' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>CURRENT TEAM</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{team?.team_name || 'Loading...'}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)' }}>{team?.project_type?.toUpperCase()} PROJECT</p>
                </div>
            </aside>

            <main className="main-view animate-fade-in">
                <header style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>Welcome, <span className="text-gradient">Explorer</span></h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Week 4 of 14 • <span style={{ color: 'var(--text-primary)' }}>Price Gap Calculation</span>
                    </p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '3rem' }}>
                    {/* Course Roadmap */}
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem' }}>Your Learning Roadmap</h2>
                            <span className="badge badge-info">28% Complete</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {weeks.map(week => (
                                <div key={week.id} className="glass-card" style={{ padding: '2rem', position: 'relative' }}>
                                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                        <div style={{
                                            flexShrink: 0,
                                            width: '48px',
                                            height: '48px',
                                            background: week.week_number <= 4 ? 'var(--accent-primary)' : 'var(--bg-elevated)',
                                            borderRadius: '14px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 700,
                                            fontSize: '1.2rem',
                                            boxShadow: week.week_number <= 4 ? 'var(--shadow-accent)' : 'none'
                                        }}>
                                            {week.week_number}
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{week.title}</h3>
                                            <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>{week.overview}</p>

                                            {week.deliverable_spec && (
                                                <div style={{ background: 'var(--accent-soft)', padding: '1rem', borderRadius: '12px', borderLeft: '3px solid var(--accent-primary)' }}>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>DELIVERABLE GUIDANCE</p>
                                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{week.deliverable_spec.hint || "Refer to instructions for details."}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {week.week_number === 4 && (
                                        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
                                            <span className="badge badge-success">Current Task</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Sidebar Actions */}
                    <aside style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '0.5rem' }}>Bi-Weekly Pulse</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                                How's your team doing today?
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                {['😊', '😐', '🙁'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setSentiment(s)}
                                        style={{
                                            fontSize: '2rem',
                                            padding: '10px',
                                            borderRadius: '12px',
                                            background: sentiment === s ? 'var(--accent-soft)' : 'transparent',
                                            border: sentiment === s ? '1px solid var(--accent-primary)' : '1px solid transparent',
                                            cursor: 'pointer',
                                            transition: 'var(--transition-fast)'
                                        }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            <textarea
                                value={pulseFeedback}
                                onChange={e => setPulseFeedback(e.target.value)}
                                placeholder="Anything on your mind? (optional)"
                                className="glass-card"
                                style={{ width: '100%', background: 'var(--bg-darker)', padding: '12px', fontSize: '0.85rem', color: 'white', borderRadius: '10px', resize: 'none', marginBottom: '1rem' }}
                                rows={2}
                            />
                            <button onClick={handlePulse} className="btn btn-secondary" style={{ width: '100%' }}>
                                Submit Pulse
                            </button>
                        </div>

                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '0.5rem' }}>Ask your Mentor</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                Have questions? AI will summarize your query for the professor to ensure a rapid response.
                            </p>
                            <form onSubmit={handleContact} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <input
                                    value={message.subject}
                                    onChange={e => setMessage({ ...message, subject: e.target.value })}
                                    placeholder="Brief subject..."
                                    className="glass-card"
                                    style={{ background: 'var(--bg-darker)', padding: '12px', fontSize: '0.9rem', color: 'white', borderRadius: '10px' }}
                                    required
                                />
                                <textarea
                                    value={message.body}
                                    onChange={e => setMessage({ ...message, body: e.target.value })}
                                    placeholder="Describe your challenge..."
                                    rows={5}
                                    className="glass-card"
                                    style={{ background: 'var(--bg-darker)', padding: '12px', fontSize: '0.9rem', color: 'white', borderRadius: '10px', resize: 'none' }}
                                    required
                                />
                                <button disabled={sending} className="btn btn-primary" style={{ width: '100%' }}>
                                    {sending ? 'Sending...' : 'Transmit Query'}
                                </button>
                            </form>
                        </div>

                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Submissions</h3>
                            {weeks.find(w => w.week_number === 4) && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>WEEK 4 DELIVERABLE</p>
                                    <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Price Gap Analysis</p>
                                </div>
                            )}

                            <div
                                style={{
                                    border: '2px dashed var(--border-medium)',
                                    borderRadius: '16px',
                                    padding: '3rem 1rem',
                                    textAlign: 'center',
                                    transition: 'var(--transition-base)',
                                    cursor: 'pointer',
                                    background: syncing ? 'var(--accent-soft)' : 'transparent'
                                }}
                                onClick={() => document.getElementById('file-upload')?.click()}
                            >
                                <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📁</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    {syncing ? 'ANALYZING...' : 'Drop your analysis here'}
                                </p>
                                <input
                                    id="file-upload"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) handleUpload(e.target.files[0]);
                                    }}
                                />
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
