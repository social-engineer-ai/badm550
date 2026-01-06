'use client';
import { useEffect, useState } from 'react';
import { projectsApi } from '@/lib/api';
import Link from 'next/link';

interface Project {
    id: number;
    name: string;
    description: string;
    client_name: string;
    status: string;
    milestone_count: number;
}

export default function StudentProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        projectsApi.list()
            .then(setProjects)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="app-container">
                <div className="main-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p className="text-secondary animate-pulse">Loading projects...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div style={{ marginBottom: '3rem' }}>
                    <h2 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>BADM 550</h2>
                    <p style={{ fontSize: '0.75rem', fontWeight: 500 }}>STUDENT PORTAL</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <a href="/student" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        Home
                    </a>
                    <a href="/student/projects" className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--accent-secondary)' }}>
                        Projects
                    </a>
                    <a href="/student/team" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        My Team
                    </a>
                </nav>
            </aside>

            <main className="main-view animate-fade-in">
                <header style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        <span className="text-gradient">Projects</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Your client projects and milestones
                    </p>
                </header>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {projects.length === 0 ? (
                        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-secondary)' }}>No projects available yet.</p>
                        </div>
                    ) : (
                        projects.map((project) => (
                            <Link
                                key={project.id}
                                href={`/student/projects/${project.id}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <div className="glass-card" style={{
                                    padding: '2rem',
                                    cursor: 'pointer',
                                    transition: 'var(--transition-base)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                                {project.name}
                                            </h2>
                                            <p style={{ color: 'var(--accent-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                                Client: {project.client_name || 'TBD'}
                                            </p>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                                {project.description}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span className={`badge ${
                                                project.status === 'active' ? 'badge-success' :
                                                project.status === 'draft' ? 'badge-warning' :
                                                'badge-info'
                                            }`}>
                                                {project.status?.toUpperCase()}
                                            </span>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                                                {project.milestone_count} milestone{project.milestone_count !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
