"use client";
import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';

export default function InstructorGradebook() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<any>(null); // {studentId, weekId, score, feedback}

    const fetchData = async () => {
        try {
            const res = await apiRequest('/instructor/grades');
            setData(res);
        } catch (err) {
            console.error("Failed to fetch gradebook", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async () => {
        try {
            await apiRequest('/instructor/grades', {
                method: 'POST',
                body: JSON.stringify(editing)
            });
            setEditing(null);
            fetchData();
        } catch (err) {
            alert("Failed to save grade.");
        }
    };

    if (loading) return (
        <div className="app-container">
            <div className="main-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p className="text-secondary animate-pulse">Assembling Global Gradebook...</p>
            </div>
        </div>
    );

    const getGrade = (studentId: number, weekId: number) => {
        return data.grades.find((g: any) => g.student_id === studentId && g.week_id === weekId);
    };

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
                    <a href="/instructor/teams" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        👥 Team Roster
                    </a>
                    <a href="/instructor/gradebook" className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--accent-secondary)' }}>
                        📝 Gradebook
                    </a>
                    <a href="/instructor/roadmap" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        🎯 Roadmap
                    </a>
                </nav>
            </aside>

            <main className="main-view animate-fade-in" style={{ maxWidth: '100%' }}>
                <header style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>Central <span className="text-gradient">Registrar</span></h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Managing performance assessments for <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{data.students.length}</span> candidates.
                    </p>
                </header>

                <div className="glass-card" style={{ overflowX: 'auto', padding: '1rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-light)' }}>
                                <th style={{ padding: '1.5rem', position: 'sticky', left: 0, background: 'var(--bg-elevated)', zIndex: 10 }}>STUDENT</th>
                                {data.weeks.map((w: any) => (
                                    <th key={w.id} style={{ padding: '1.5rem', textAlign: 'center' }}>WK {w.week_number}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.students.map((student: any) => (
                                <tr key={student.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '1.5rem', position: 'sticky', left: 0, background: 'var(--bg-dark)', zIndex: 5 }}>
                                        <p style={{ fontWeight: 600 }}>{student.user?.first_name} {student.user?.last_name}</p>
                                        <p style={{ fontSize: '0.7rem', opacity: 0.5 }}>{student.user?.email}</p>
                                    </td>
                                    {data.weeks.map((week: any) => {
                                        const grade = getGrade(student.id, week.id);
                                        return (
                                            <td key={week.id} style={{ padding: '1.5rem', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => setEditing({ student_id: student.id, week_id: week.id, score: grade?.score || 100, feedback: grade?.feedback || '' })}
                                                    className={`badge ${!grade ? 'badge-ghost' : grade.score >= 90 ? 'badge-success' : 'badge-info'}`}
                                                    style={{ cursor: 'pointer', border: 'none', width: '60px' }}
                                                >
                                                    {grade ? `${grade.score}%` : '--'}
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Grade Edit Modal */}
                {editing && (
                    <div className="modal-overlay" style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div className="glass-card" style={{ padding: '3rem', width: '90%', maxWidth: '400px' }}>
                            <h2 style={{ marginBottom: '2rem' }}>Audit Assessment</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>NUMERIC SCORE (%)</label>
                                    <input
                                        type="number"
                                        className="glass-card"
                                        style={{ width: '100%', background: 'var(--bg-darker)', padding: '12px', marginTop: '6px', color: 'white' }}
                                        value={editing.score}
                                        onChange={e => setEditing({ ...editing, score: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>QUALITATIVE FEEDBACK</label>
                                    <textarea
                                        className="glass-card"
                                        style={{ width: '100%', background: 'var(--bg-darker)', padding: '12px', marginTop: '6px', color: 'white', resize: 'none' }}
                                        rows={4}
                                        value={editing.feedback}
                                        onChange={e => setEditing({ ...editing, feedback: e.target.value })}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button onClick={handleSave} className="btn btn-primary" style={{ flex: 1 }}>Save Ledger</button>
                                    <button onClick={() => setEditing(null)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
