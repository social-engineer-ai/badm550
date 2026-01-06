'use client';
import { useEffect, useState } from 'react';
import { projectsApi, apiRequest } from '@/lib/api';
import Link from 'next/link';

interface Project {
    id: number;
    name: string;
    description: string;
    client_name: string;
    status: string;
    milestone_count: number;
    created_at: string;
}

export default function InstructorProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        Promise.all([
            projectsApi.list(),
            apiRequest('/auth/me')
        ])
            .then(([projectsData, userData]) => {
                setProjects(projectsData);
                setUser(userData);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (projectId: number) => {
        if (!confirm('Are you sure you want to delete this project? This will also delete all milestones and submissions.')) {
            return;
        }
        try {
            await projectsApi.delete(projectId);
            setProjects(projects.filter(p => p.id !== projectId));
        } catch (error) {
            alert('Failed to delete project');
        }
    };

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
                    <p style={{ fontSize: '0.75rem', fontWeight: 500 }}>INSTRUCTOR PORTAL</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <a href="/instructor" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        Dashboard
                    </a>
                    <a href="/instructor/projects" className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--accent-secondary)' }}>
                        Projects
                    </a>
                    <a href="/instructor/admin" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        Admin
                    </a>
                </nav>

                <div className="glass-card" style={{ padding: '1.25rem', marginTop: 'auto' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>LOGGED IN AS</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.first_name} {user?.last_name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)' }}>{user?.role?.toUpperCase()}</p>
                </div>
            </aside>

            <main className="main-view animate-fade-in">
                <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                            <span className="text-gradient">Manage Projects</span>
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                            Create and manage client projects for students
                        </p>
                    </div>
                    <Link href="/instructor/projects/new" className="btn btn-primary">
                        + New Project
                    </Link>
                </header>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {projects.length === 0 ? (
                        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>No projects yet.</p>
                            <Link href="/instructor/projects/new" className="btn btn-secondary">
                                Create Your First Project
                            </Link>
                        </div>
                    ) : (
                        projects.map((project) => (
                            <div key={project.id} className="glass-card" style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                                                {project.name}
                                            </h2>
                                            <span className={`badge ${
                                                project.status === 'active' ? 'badge-success' :
                                                project.status === 'draft' ? 'badge-warning' :
                                                'badge-info'
                                            }`}>
                                                {project.status?.toUpperCase()}
                                            </span>
                                        </div>
                                        <p style={{ color: 'var(--accent-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                                            Client: {project.client_name || 'TBD'}
                                        </p>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem' }}>
                                            {project.description}
                                        </p>
                                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            <span>{project.milestone_count} milestone{project.milestone_count !== 1 ? 's' : ''}</span>
                                            <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Link
                                            href={`/instructor/projects/${project.id}/edit`}
                                            className="btn btn-secondary"
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                        >
                                            Edit
                                        </Link>
                                        {user?.role === 'admin' && (
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="btn btn-ghost"
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    fontSize: '0.85rem',
                                                    color: 'var(--danger)'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
