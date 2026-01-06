'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { projectsApi } from '@/lib/api';
import Link from 'next/link';

export default function NewProjectPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        client_name: '',
        status: 'draft'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const project = await projectsApi.create(formData);
            router.push(`/instructor/projects/${project.id}/edit`);
        } catch (error) {
            alert('Failed to create project');
        } finally {
            setSaving(false);
        }
    };

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
            </aside>

            <main className="main-view animate-fade-in">
                <div style={{ marginBottom: '1rem' }}>
                    <Link href="/instructor/projects" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
                        ← Back to Projects
                    </Link>
                </div>

                <header style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        <span className="text-gradient">New Project</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Create a new client project for your students
                    </p>
                </header>

                <div className="glass-card" style={{ padding: '2rem', maxWidth: '600px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                                PROJECT NAME *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., AWG Pricing Analysis"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '10px',
                                    background: 'var(--bg-darker)',
                                    border: '1px solid var(--border-light)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem'
                                }}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                                CLIENT NAME
                            </label>
                            <input
                                type="text"
                                value={formData.client_name}
                                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                                placeholder="e.g., Associated Wholesale Grocers"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '10px',
                                    background: 'var(--bg-darker)',
                                    border: '1px solid var(--border-light)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                                DESCRIPTION
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Project overview and objectives..."
                                rows={5}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '10px',
                                    background: 'var(--bg-darker)',
                                    border: '1px solid var(--border-light)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                                STATUS
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '10px',
                                    background: 'var(--bg-darker)',
                                    border: '1px solid var(--border-light)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <option value="draft">Draft</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button
                                type="submit"
                                disabled={saving || !formData.name}
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                            >
                                {saving ? 'Creating...' : 'Create Project'}
                            </button>
                            <Link href="/instructor/projects" className="btn btn-ghost" style={{ flex: 1, textAlign: 'center' }}>
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
