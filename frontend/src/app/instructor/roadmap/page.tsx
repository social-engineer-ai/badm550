"use client";
import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';

export default function RoadmapEditor() {
    const [weeks, setWeeks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingWeek, setEditingWeek] = useState<any>(null);

    useEffect(() => {
        async function fetchWeeks() {
            try {
                const data = await apiRequest('/instructor/weeks');
                setWeeks(data);
            } catch (err) {
                console.error("Failed to fetch weeks", err);
            } finally {
                setLoading(false);
            }
        }
        fetchWeeks();
    }, []);

    const handleSave = async () => {
        try {
            await apiRequest(`/instructor/weeks/${editingWeek.id}`, {
                method: 'PUT',
                body: JSON.stringify(editingWeek)
            });
            setWeeks(weeks.map(w => w.id === editingWeek.id ? editingWeek : w));
            setEditingWeek(null);
            alert("Roadmap updated successfully!");
        } catch (err) {
            alert("Failed to save changes.");
        }
    };

    if (loading) return (
        <div className="app-container">
            <div className="main-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p className="text-secondary animate-pulse">Loading Curriculum...</p>
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
                    <a href="/instructor/roadmap" className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--accent-secondary)' }}>
                        🎯 Roadmap Editor
                    </a>
                    <a href="/instructor/teams" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        👥 Team Roster
                    </a>
                </nav>
            </aside>

            <main className="main-view animate-fade-in">
                <header style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>Course <span className="text-gradient">Architect</span></h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Designing the 14-week analytical journey for BADM 550.
                    </p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3rem' }}>
                    {/* Week List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {weeks.map(week => (
                            <div
                                key={week.id}
                                className={`glass-card ${editingWeek?.id === week.id ? 'active-border' : ''}`}
                                style={{
                                    padding: '1.5rem',
                                    cursor: 'pointer',
                                    border: editingWeek?.id === week.id ? '1px solid var(--accent-primary)' : '1px solid transparent'
                                }}
                                onClick={() => setEditingWeek({ ...week })}
                            >
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: '36px', height: '36px', background: 'var(--bg-elevated)', borderRadius: '10px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                                    }}>
                                        {week.week_number}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem' }}>{week.title}</h3>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{week.overview.substring(0, 60)}...</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Editor View */}
                    <div className="glass-card" style={{ padding: '2.5rem', position: 'sticky', top: '2rem', height: 'fit-content' }}>
                        {editingWeek ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Edit Week {editingWeek.week_number}</h2>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Changes will be visible to students immediately.</p>
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>WEEK TITLE</label>
                                    <input
                                        className="glass-card"
                                        style={{ width: '100%', background: 'var(--bg-darker)', padding: '12px', marginTop: '6px', color: 'white' }}
                                        value={editingWeek.title}
                                        onChange={e => setEditingWeek({ ...editingWeek, title: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>OVERVIEW / LEARNING OBJECTIVES</label>
                                    <textarea
                                        className="glass-card"
                                        style={{ width: '100%', background: 'var(--bg-darker)', padding: '12px', marginTop: '6px', color: 'white', resize: 'none' }}
                                        rows={4}
                                        value={editingWeek.overview}
                                        onChange={e => setEditingWeek({ ...editingWeek, overview: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>DELIVERABLE GUIDANCE (AI HINT)</label>
                                    <textarea
                                        className="glass-card"
                                        style={{ width: '100%', background: 'var(--bg-darker)', padding: '12px', marginTop: '6px', color: 'white', resize: 'none' }}
                                        rows={3}
                                        value={editingWeek.deliverable_spec?.hint || ''}
                                        onChange={e => setEditingWeek({
                                            ...editingWeek,
                                            deliverable_spec: { ...editingWeek.deliverable_spec, hint: e.target.value }
                                        })}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button
                                        className="btn btn-primary"
                                        style={{ flex: 1, padding: '14px' }}
                                        onClick={handleSave}
                                    >
                                        Deploy Updates
                                    </button>
                                    <button
                                        className="btn btn-ghost"
                                        style={{ flex: 1, padding: '14px' }}
                                        onClick={() => setEditingWeek(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                                <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📐</p>
                                <h3>Select a Week to Architect</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>All updates synchronize with the Student Learning Roadmap.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
