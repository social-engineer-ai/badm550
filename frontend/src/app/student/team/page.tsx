"use client";
import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';

export default function StudentTeamPage() {
    const [collabData, setCollabData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showFrustration, setShowFrustration] = useState(false);
    const [friction, setFriction] = useState({ category: 'team', impact_level: 'affecting me', message: '', is_anonymous: false });
    const [showMeetingReq, setShowMeetingReq] = useState(false);
    const [meeting, setMeeting] = useState({ topic: '', description: '', duration: 30 });

    const fetchData = async () => {
        try {
            const data = await apiRequest('/students/me/collaboration');
            setCollabData(data);
        } catch (err) {
            console.error("Failed to fetch collaboration data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFrictionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiRequest('/students/frustration', {
                method: 'POST',
                body: JSON.stringify(friction)
            });
            alert("Report submitted confidentially to the instructor team.");
            setShowFrustration(false);
            setFriction({ category: 'team', impact_level: 'affecting me', message: '', is_anonymous: false });
        } catch (err) {
            alert("Failed to submit report.");
        }
    };

    const handleMeetingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiRequest('/students/meeting-request', {
                method: 'POST',
                body: JSON.stringify(meeting)
            });
            alert("Meeting request sent! Check your email for confirmation.");
            setShowMeetingReq(false);
            setMeeting({ topic: '', description: '', duration: 30 });
            fetchData();
        } catch (err) {
            alert("Failed to request meeting.");
        }
    };

    if (loading) return (
        <div className="app-container">
            <div className="main-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p className="text-secondary animate-pulse">Syncing with Team Workspace...</p>
            </div>
        </div>
    );

    const team = collabData?.team;

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div style={{ marginBottom: '3rem' }}>
                    <h2 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>BADM 550</h2>
                    <p style={{ fontSize: '0.75rem', fontWeight: 500 }}>STUDENT PORTAL</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <a href="/student" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        🏠 Home
                    </a>
                    <a href="#" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        🎯 Roadmap
                    </a>
                    <a href="/student/team" className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--accent-secondary)' }}>
                        📂 My Team
                    </a>
                </nav>
            </aside>

            <main className="main-view animate-fade-in">
                <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>Team <span className="text-gradient">{team?.name}</span></h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                            Collaborating on the <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{team?.project?.name}</span> Client Project.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => setShowMeetingReq(true)} className="btn btn-secondary">Request Office Hours</button>
                        <button onClick={() => setShowFrustration(true)} className="btn btn-ghost" style={{ border: '1px solid var(--danger)', color: 'var(--danger)' }}>Report Friction</button>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem' }}>
                    {/* Team Roster */}
                    <section>
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Team Roster</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {team?.memberships?.map((m: any) => (
                                    <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <div style={{
                                                width: '40px', height: '40px', background: 'var(--bg-elevated)',
                                                borderRadius: '12px', display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', fontWeight: 700
                                            }}>
                                                {m.student?.user?.first_name[0]}{m.student?.user?.last_name[0]}
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 600 }}>{m.student?.user?.first_name} {m.student?.user?.last_name}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.role || 'Member'}</p>
                                            </div>
                                        </div>
                                        <span className={`badge ${m.student?.id === team.lead_id ? 'badge-info' : 'badge-ghost'}`} style={{ fontSize: '0.7rem' }}>
                                            {m.student?.id === team.lead_id ? 'LEAD' : 'ACTIVE'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '2rem', marginTop: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Team Pulse Trend</h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {['😊', '😊', '😐', '😊', '😐'].map((e, i) => (
                                    <div key={i} style={{ flex: 1, padding: '10px', background: 'var(--bg-darker)', borderRadius: '8px', textAlign: 'center' }}>{e}</div>
                                ))}
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem', textAlign: 'center' }}>Last 5 Pulse Checks</p>
                        </div>
                    </section>

                    {/* Team Activity */}
                    <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Team Submissions</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {!collabData?.submissions || collabData.submissions.length === 0 ? <p style={{ opacity: 0.5 }}>No submissions yet.</p> :
                                    collabData.submissions.map((sub: any) => (
                                        <div key={sub.id} className="glass-card" style={{ background: 'var(--bg-darker)', padding: '1.25rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <p style={{ fontWeight: 600 }}>Week {sub.week?.week_number || '?'}: {sub.file_url}</p>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(sub.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <span className={`badge ${sub.status === 'approved' ? 'badge-success' : sub.status === 'flagged' ? 'badge-danger' : 'badge-warning'}`}>
                                                    {sub.status.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Scheduled Meetings</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {!collabData?.meetings || collabData.meetings.length === 0 ? <p style={{ opacity: 0.5 }}>No meetings scheduled.</p> :
                                    collabData.meetings.map((m: any) => (
                                        <div key={m.id} className="glass-card" style={{ background: 'var(--bg-darker)', padding: '1.25rem' }}>
                                            <p style={{ fontWeight: 600 }}>{m.topic}</p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                                <span style={{ color: 'var(--accent-secondary)' }}>{m.status.toUpperCase()}</span>
                                                <span style={{ opacity: 0.6 }}>{m.duration} mins</span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Frustration Modal */}
                {showFrustration && (
                    <div className="modal-overlay" style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div className="glass-card" style={{ padding: '3rem', width: '90%', maxWidth: '500px' }}>
                            <h2 style={{ marginBottom: '0.5rem' }}>Report Team Friction</h2>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>This report is sent directly to the instructor and is strictly confidential.</p>

                            <form onSubmit={handleFrictionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>CATEGORY</label>
                                    <select
                                        className="glass-card"
                                        style={{ width: '100%', background: 'var(--bg-darker)', padding: '12px', marginTop: '6px', color: 'white' }}
                                        value={friction.category}
                                        onChange={e => setFriction({ ...friction, category: e.target.value })}
                                    >
                                        <option value="team">Interpersonal / Teamwork</option>
                                        <option value="project">Project / Task Blockers</option>
                                        <option value="client">Client Communication</option>
                                        <option value="workload">Workload Distribution</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>IMPACT LEVEL</label>
                                    <select
                                        className="glass-card"
                                        style={{ width: '100%', background: 'var(--bg-darker)', padding: '12px', marginTop: '6px', color: 'white' }}
                                        value={friction.impact_level}
                                        onChange={e => setFriction({ ...friction, impact_level: e.target.value })}
                                    >
                                        <option value="affecting me">Affecting me individually</option>
                                        <option value="affecting team">Affecting team progress</option>
                                        <option value="critical">Critical / Project at risk</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>MESSAGE</label>
                                    <textarea
                                        required
                                        className="glass-card"
                                        style={{ width: '100%', background: 'var(--bg-darker)', padding: '12px', marginTop: '6px', color: 'white', resize: 'none' }}
                                        rows={4}
                                        value={friction.message}
                                        onChange={e => setFriction({ ...friction, message: e.target.value })}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit Confidential Report</button>
                                    <button type="button" onClick={() => setShowFrustration(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Meeting Request Modal */}
                {showMeetingReq && (
                    <div className="modal-overlay" style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div className="glass-card" style={{ padding: '3rem', width: '90%', maxWidth: '500px' }}>
                            <h2 style={{ marginBottom: '0.5rem' }}>Request Support Meeting</h2>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Request an office hours slot for your team.</p>

                            <form onSubmit={handleMeetingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOPIC</label>
                                    <input
                                        required
                                        className="glass-card"
                                        style={{ width: '100%', background: 'var(--bg-darker)', padding: '12px', marginTop: '6px', color: 'white' }}
                                        value={meeting.topic}
                                        onChange={e => setMeeting({ ...meeting, topic: e.target.value })}
                                        placeholder="e.g. Q3 revenue reconciliation help"
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>DESCRIPTION</label>
                                    <textarea
                                        required
                                        className="glass-card"
                                        style={{ width: '100%', background: 'var(--bg-darker)', padding: '12px', marginTop: '6px', color: 'white', resize: 'none' }}
                                        rows={3}
                                        value={meeting.description}
                                        onChange={e => setMeeting({ ...meeting, description: e.target.value })}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="submit" className="btn btn-secondary" style={{ flex: 1 }}>Request Slot</button>
                                    <button type="button" onClick={() => setShowMeetingReq(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
