"use client";
import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';

export default function StudentGradesPage() {
    const [grades, setGrades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGrades() {
            try {
                const data = await apiRequest('/students/me/grades');
                setGrades(data);
            } catch (err) {
                console.error("Failed to fetch grades", err);
            } finally {
                setLoading(false);
            }
        }
        fetchGrades();
    }, []);

    if (loading) return (
        <div className="app-container">
            <div className="main-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p className="text-secondary animate-pulse">Syncing Grade Ledger...</p>
            </div>
        </div>
    );

    const totalPossible = grades.length * 100;
    const earned = grades.reduce((acc, g) => acc + g.score, 0);
    const average = grades.length > 0 ? (earned / grades.length).toFixed(1) : 0;

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
                    <a href="/student/team" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        📂 My Team
                    </a>
                    <a href="/student/grades" className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--accent-secondary)' }}>
                        📊 Grades
                    </a>
                </nav>
            </aside>

            <main className="main-view animate-fade-in">
                <header style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>Performance <span className="text-gradient">Ledger</span></h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Reviewing assessment scores for the current practicum cycle.
                    </p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>CUMULATIVE SCORE</p>
                        <h3 style={{ fontSize: '2rem' }}>{earned}<span style={{ fontSize: '1rem', opacity: 0.5 }}> / {totalPossible}</span></h3>
                    </div>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>CYCLE AVERAGE</p>
                        <h3 style={{ fontSize: '2rem' }}>{average}<span style={{ fontSize: '1rem', opacity: 0.5 }}>%</span></h3>
                    </div>
                    <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid var(--accent-primary)' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>GPA IMPACT</p>
                        <h3 style={{ fontSize: '2rem' }}>EXCELLENT</h3>
                    </div>
                </div>

                <div className="glass-card" style={{ overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-light)' }}>
                                <th style={{ padding: '1.5rem' }}>ASSESSMENT</th>
                                <th style={{ padding: '1.5rem' }}>DATE</th>
                                <th style={{ padding: '1.5rem' }}>SCORE</th>
                                <th style={{ padding: '1.5rem' }}>FEEDBACK</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grades.map(grade => (
                                <tr key={grade.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '1.5rem' }}>
                                        <p style={{ fontWeight: 600 }}>Week {grade.week?.week_number}</p>
                                        <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>{grade.week?.title}</p>
                                    </td>
                                    <td style={{ padding: '1.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
                                        {new Date(grade.created_at).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1.5rem' }}>
                                        <span className={`badge ${grade.score >= 90 ? 'badge-success' : grade.score >= 80 ? 'badge-info' : 'badge-warning'}`}>
                                            {grade.score}%
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem', fontSize: '0.85rem', maxWidth: '400px', lineHeight: 1.5 }}>
                                        {grade.feedback || 'Official feedback pending review.'}
                                    </td>
                                </tr>
                            ))}
                            {grades.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', opacity: 0.5 }}>
                                        No assessment data recorded yet for this cycle.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
