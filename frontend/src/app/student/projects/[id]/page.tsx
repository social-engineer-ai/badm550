'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { projectsApi } from '@/lib/api';
import Link from 'next/link';

interface Resource {
    id: number;
    title: string;
    resource_type: string;
    url: string;
    description?: string;
}

interface Milestone {
    id: number;
    week_number: number;
    title: string;
    theme?: string;
    description?: string;
    due_date?: string;
    deliverables?: any[];
}

interface Project {
    id: number;
    name: string;
    description: string;
    client_name: string;
    status: string;
    milestones: Milestone[];
    resources: Resource[];
}

const resourceIcons: Record<string, string> = {
    video_youtube: '🎬',
    video_mediaspace: '🎬',
    notebook_colab: '📓',
    document: '📄',
    dataset: '📊',
    link: '🔗'
};

export default function ProjectDetailPage() {
    const params = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            projectsApi.get(Number(params.id))
                .then(setProject)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="app-container">
                <div className="main-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p className="text-secondary animate-pulse">Loading project...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="app-container">
                <div className="main-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p className="text-secondary">Project not found.</p>
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

                {/* Quick navigation to milestones */}
                {project.milestones.length > 0 && (
                    <div className="glass-card" style={{ padding: '1.25rem', marginTop: 'auto' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>JUMP TO WEEK</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {project.milestones.map(m => (
                                <Link
                                    key={m.week_number}
                                    href={`/student/projects/${project.id}/week/${m.week_number}`}
                                    className="btn btn-ghost"
                                    style={{
                                        padding: '0.5rem 0.75rem',
                                        fontSize: '0.85rem',
                                        minWidth: '40px',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {m.week_number}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </aside>

            <main className="main-view animate-fade-in">
                <div style={{ marginBottom: '1rem' }}>
                    <Link href="/student/projects" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
                        ← Back to Projects
                    </Link>
                </div>

                <header style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                            <span className="text-gradient">{project.name}</span>
                        </h1>
                        <span className={`badge ${
                            project.status === 'active' ? 'badge-success' :
                            project.status === 'draft' ? 'badge-warning' :
                            'badge-info'
                        }`}>
                            {project.status?.toUpperCase()}
                        </span>
                    </div>
                    <p style={{ color: 'var(--accent-secondary)', fontSize: '1rem', marginBottom: '0.75rem' }}>
                        Client: {project.client_name || 'TBD'}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '800px' }}>
                        {project.description}
                    </p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '3rem' }}>
                    {/* Milestones Timeline */}
                    <section>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Weekly Milestones</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {project.milestones.length === 0 ? (
                                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                                    <p style={{ color: 'var(--text-secondary)' }}>No milestones yet.</p>
                                </div>
                            ) : (
                                project.milestones
                                    .sort((a, b) => a.week_number - b.week_number)
                                    .map((milestone) => (
                                        <Link
                                            key={milestone.id}
                                            href={`/student/projects/${project.id}/week/${milestone.week_number}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <div className="glass-card" style={{
                                                padding: '1.5rem',
                                                cursor: 'pointer',
                                                transition: 'var(--transition-base)'
                                            }}>
                                                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                                                    <div style={{
                                                        flexShrink: 0,
                                                        width: '48px',
                                                        height: '48px',
                                                        background: 'var(--accent-primary)',
                                                        borderRadius: '14px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 700,
                                                        fontSize: '1.2rem',
                                                        boxShadow: 'var(--shadow-accent)'
                                                    }}>
                                                        {milestone.week_number}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                                                            {milestone.title}
                                                        </h3>
                                                        {milestone.theme && (
                                                            <p style={{ color: 'var(--accent-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                                                {milestone.theme}
                                                            </p>
                                                        )}
                                                        {milestone.deliverables && milestone.deliverables.length > 0 && (
                                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                                {milestone.deliverables.length} deliverable{milestone.deliverables.length !== 1 ? 's' : ''}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div style={{ color: 'var(--text-muted)' }}>→</div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                            )}
                        </div>
                    </section>

                    {/* Project Resources */}
                    <aside>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Project Resources</h2>
                        <div className="glass-card" style={{ padding: '1.5rem' }}>
                            {project.resources.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No resources yet.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {project.resources
                                        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                                        .map((resource) => (
                                            <a
                                                key={resource.id}
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    padding: '0.75rem',
                                                    borderRadius: '10px',
                                                    background: 'var(--bg-darker)',
                                                    textDecoration: 'none',
                                                    transition: 'var(--transition-fast)'
                                                }}
                                            >
                                                <span style={{ fontSize: '1.25rem' }}>
                                                    {resourceIcons[resource.resource_type] || '📎'}
                                                </span>
                                                <div>
                                                    <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                                                        {resource.title}
                                                    </p>
                                                    {resource.description && (
                                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                                            {resource.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </a>
                                        ))}
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
